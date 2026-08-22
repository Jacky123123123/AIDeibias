/**
 * AI Debias Kit — local dev server + AI proxy (OpenAI, with Qwen fallback)
 *
 * Why this exists:
 *   The toolkit is a pure-frontend SPA. AI API keys must never be embedded in
 *   the browser bundle (any visitor could read them), and these endpoints do
 *   not allow cross-origin browser calls. This tiny server:
 *     1. serves the static site, and
 *     2. proxies POST /api/review to an AI provider on the server side.
 *
 * Run:
 *   node server.js
 * Then open http://localhost:3000
 *
 * API keys (set in a local .env next to this script — already gitignored):
 *       IC_KEY=sk-...         (OpenAI)
 *       QWEN_API_KEY=sk-...   (Alibaba Qwen-VL, reachable inside mainland China)
 *   or export them in your shell before running.
 *
 * Provider order: OpenAI is tried first (with a short timeout); if it cannot be
 * reached, the request falls back to Qwen automatically. Both are vision-capable
 * and receive the student's image (image_url) plus the text, and return candidate
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
const OPENAI_API_KEY = process.env.IC_KEY || process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
const QWEN_API_KEY = process.env.QWEN_API_KEY || '';
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen-vl-max';
const OPENAI_TIMEOUT_MS = parseInt(process.env.OPENAI_TIMEOUT_MS || '12000', 10);

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

/* ---- Build the prompt (text + image) for OpenAI ---- */
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
    'The student has attached the image they are reviewing. Look at it directly, and ground ' +
    'any question in what is actually visible in the image and in the text below.\n\n' +
    'Rules:\n' +
    '- Ask open questions only. Never state conclusions. Use wording such as "may", ' +
    '"appears", "could", or "needs checking".\n' +
    '- Never declare the image correct, wrong, usable, safe or feasible.\n' +
    '- Do not repeat something the student already noted.\n' +
    '- Prefer design-logic questions that are hard to spot at a glance (e.g. whether ' +
    'something actually works in use, or whether a claim is unverified), over obvious ' +
    'rendering glitches.\n' +
    '- Only raise a question when there is a reasonable basis in the image, the prompt, ' +
    'the intention, the capability or the student notes. If there is no solid basis, ' +
    'return zero questions.\n' +
    '- Return at most 4 questions; fewer (including zero) is fine. Do not invent questions ' +
    'to reach a count.\n' +
    '- Reply with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:\n' +
    '{"questions":[{"question":"...","basis":"...","relatedCard":"..."}]}\n' +
    '- "question": a friendly, open question in plain English.\n' +
    '- "basis": one short sentence saying why this was raised (refer to the image, the ' +
    'prompt, the intention, the capability, or a note).\n' +
    '- "relatedCard": the closest card title from the provided list, or exactly ' +
    '"No direct card match" if none fits.';

  const userText =
    'Student input:\n' +
    'Prompt: ' + (payload.prompt || '') + '\n' +
    'Intended use: ' + (payload.intention || '') + '\n' +
    'How they used AI: ' + (payload.capability || 'Not specified') + '\n' +
    'Their own observations:\n' + observations + '\n\n' +
    'Available Error & Uncertainty Cards: ' + cards + '\n\n' +
    'Raise up to 4 candidate follow-up questions as JSON.';

  const userContent = [{ type: 'text', text: userText }];
  if (payload.image && typeof payload.image === 'string') {
    userContent.push({ type: 'image_url', image_url: { url: payload.image } });
  }

  return [
    { role: 'system', content: system },
    { role: 'user', content: userContent }
  ];
}

function parseQuestions(content) {
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

async function callOpenAI(payload) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: buildMessages(payload),
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 1200
    }),
    signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS)
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('OpenAI HTTP ' + resp.status + ': ' + text.slice(0, 300));
  }

  const data = await resp.json();
  const content = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : '';
  return parseQuestions(content);
}

async function callQwen(payload) {
  const resp = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + QWEN_API_KEY
    },
    body: JSON.stringify({
      model: QWEN_MODEL,
      messages: buildMessages(payload),
      temperature: 0.4,
      max_tokens: 1200
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('Qwen HTTP ' + resp.status + ': ' + text.slice(0, 300));
  }

  const data = await resp.json();
  const content = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : '';
  return parseQuestions(content);
}

async function callAI(payload) {
  const errors = [];
  if (OPENAI_API_KEY) {
    try {
      return await callOpenAI(payload);
    } catch (e) {
      errors.push('OpenAI: ' + e.message);
      console.error('[ai] OpenAI failed, trying Qwen:', e.message);
    }
  }
  if (QWEN_API_KEY) {
    try {
      return await callQwen(payload);
    } catch (e) {
      errors.push('Qwen: ' + e.message);
    }
  }
  throw new Error(errors.join(' | ') || 'No AI provider key is configured.');
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
      if (!OPENAI_API_KEY && !QWEN_API_KEY) {
        json(res, 503, { error: 'No AI provider key is set. Add IC_KEY (OpenAI) or QWEN_API_KEY (Qwen) to .env.' });
        return;
      }
      const body = await readBody(req);
      let payload = {};
      try { payload = JSON.parse(body || '{}'); } catch (e) { payload = {}; }
      const result = await callAI(payload);
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
  console.log(OPENAI_API_KEY ? 'OpenAI key: loaded (model: ' + OPENAI_MODEL + ')' : 'OpenAI key: NOT set');
  console.log(QWEN_API_KEY ? 'Qwen key: loaded (model: ' + QWEN_MODEL + ')' : 'Qwen key: NOT set');
  console.log('');
});
