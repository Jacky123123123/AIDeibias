/**
 * AI Debias Kit — local dev server + DeepSeek proxy
 *
 * Why this exists:
 *   The toolkit is a pure-frontend SPA. The DeepSeek API key must never be
 *   embedded in the browser bundle (any visitor could read it), and DeepSeek's
 *   endpoint does not allow cross-origin browser calls. This tiny server:
 *     1. serves the static site, and
 *     2. proxies POST /api/review to DeepSeek on the server side.
 *
 * Run:
 *   node server.js
 * Then open http://localhost:3000
 *
 * API key:
 *   Set it in a local .env file next to this script (already gitignored):
 *       DEEPSEEK_API_KEY=sk-...
 *   or export it in your shell before running.
 *
 * Note: DeepSeek's chat-completions API is text-only, so the image itself is
 * not sent to the model. The request carries the prompt, intention, capability,
 * the user's own notes and the card list, and the model returns candidate
 * follow-up questions framed as "worth checking" — never verdicts.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const WEB_ROOT = __dirname;

/* ---- Load a local .env (gitignored) if present ---- */
function loadEnv() {
  const p = path.join(WEB_ROOT, '.env');
  if (!fs.existsSync(p)) return;
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
}
loadEnv();
const API_KEY = process.env.DEEPSEEK_API_KEY || '';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.md': 'text/plain; charset=utf-8'
};

function json(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

/* ---- Static file serving (kept inside WEB_ROOT) ---- */
function serveStatic(req, res) {
  let pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(WEB_ROOT, pathname));
  if (!filePath.startsWith(WEB_ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found'); return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(buf);
  });
}

/* ---- Build the text-only prompt for DeepSeek ---- */
function buildMessages(payload) {
  const observations = (payload.observations || [])
    .map((o) => {
      const card = o.card ? ' [' + o.card + ']' : '';
      return '- ' + o.text + card;
    })
    .join('\n') || 'None recorded';

  const cards = (payload.cards || []).join(', ');

  const system =
    'You are a cautious "second reader" for a design student who has just reviewed ' +
    'their own AI-generated product concept image. The student has already written their ' +
    'own observations first. Your only job is to raise a few candidate follow-up questions ' +
    'they may have overlooked.\n\n' +
    'Rules:\n' +
    '- Ask open questions only. Never state conclusions. Use wording such as "may", ' +
    '"appears", "could", or "needs checking".\n' +
    '- Never declare the image correct, wrong, usable, safe or feasible.\n' +
    '- Do not repeat something the student already noted.\n' +
    '- Prefer design-logic questions that are hard to spot at a glance (e.g. whether ' +
    'something actually works in use, or whether a claim is unverified), over obvious ' +
    'rendering glitches.\n' +
    '- Only raise a question when there is a reasonable basis in the prompt, intention, ' +
    'capability or the student notes. If there is no solid basis, return zero questions.\n' +
    '- Return at most 4 questions; fewer (including zero) is fine. Do not invent questions ' +
    'to reach a count.\n' +
    '- Reply with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:\n' +
    '{"questions":[{"question":"...","basis":"...","relatedCard":"..."}]}\n' +
    '- "question": a friendly, open question in plain English.\n' +
    '- "basis": one short sentence saying why this was raised (refer to the prompt, the ' +
    'intention, the capability, or a note).\n' +
    '- "relatedCard": the closest card title from the provided list, or exactly ' +
    '"No direct card match" if none fits.';

  const user =
    'Student input:\n' +
    'Prompt: ' + (payload.prompt || '') + '\n' +
    'Intended use: ' + (payload.intention || '') + '\n' +
    'How they used AI: ' + (payload.capability || 'Not specified') + '\n' +
    'Their own observations:\n' + observations + '\n\n' +
    'Available Error & Uncertainty Cards: ' + cards + '\n\n' +
    'Raise up to 4 candidate follow-up questions as JSON.';

  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}

async function callDeepSeek(payload) {
  const resp = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + API_KEY
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: buildMessages(payload),
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 1200
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('DeepSeek HTTP ' + resp.status + ': ' + text.slice(0, 300));
  }

  const data = await resp.json();
  const content = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : '';

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    // Some models wrap JSON in code fences; strip them as a fallback.
    const cleaned = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const questions = (parsed.questions || [])
    .filter((q) => q && q.question)
    .slice(0, 4)
    .map((q) => ({
      question: String(q.question).trim(),
      basis: String(q.basis || '').trim(),
      relatedCard: String(q.relatedCard || 'No direct card match').trim()
    }));

  return { questions: questions };
}

/* ---- Server ---- */
http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    if (req.method === 'POST' && (req.url || '').split('?')[0] === '/api/review') {
      if (!API_KEY) {
        json(res, 503, { error: 'DEEPSEEK_API_KEY is not set. Add it to a local .env file.' });
        return;
      }
      const body = await readBody(req);
      let payload = {};
      try { payload = JSON.parse(body || '{}'); } catch (e) { payload = {}; }
      const result = await callDeepSeek(payload);
      json(res, 200, result);
      return;
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      serveStatic(req, res);
      return;
    }

    res.writeHead(405); res.end('Method not allowed');
  } catch (err) {
    console.error('[server]', err.message);
    json(res, 500, { error: 'Server error: ' + err.message });
  }
}).listen(PORT, () => {
  console.log('AI Debias Kit running on http://localhost:' + PORT);
  console.log(API_KEY ? 'DeepSeek API key: loaded' : 'DeepSeek API key: NOT set (AI suggestions disabled)');
  console.log('');
});
