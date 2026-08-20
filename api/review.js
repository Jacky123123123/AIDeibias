/**
 * AI Debias Kit — serverless /api/review (Vercel)
 *
 * This is the public equivalent of server.js. When the site is deployed to
 * Vercel, this file becomes https://<your-app>.vercel.app/api/review and the
 * frontend calls it same-origin, so no CORS is needed in normal use.
 *
 * The DeepSeek key is read from the Vercel environment variable
 * DEEPSEEK_API_KEY (set it in the Vercel dashboard — never in the repo).
 *
 * Notes:
 * - DeepSeek's chat API is text-only, so the image itself is not sent. The
 *   request carries prompt / intention / capability / user notes / card list.
 * - Rate limiting here is a best-effort in-memory limiter (per warm instance).
 *   For real protection add Upstash Ratelimit and restrict ALLOWED_ORIGIN.
 */

'use strict';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '15', 10);
const RATE_WINDOW_MS = parseInt(process.env.RATE_WINDOW_MS || '300000', 10); // 5 min

// In-memory, per-IP sliding window. Persists only while the instance is warm.
const hits = new Map();

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(res, status, obj) {
  res.writeHead(status, Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, corsHeaders()));
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve) => {
    // Vercel's @vercel/node runtime auto-parses JSON bodies into req.body.
    if (req.body !== undefined && req.body !== null) {
      resolve(req.body);
      return;
    }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { resolve({}); }
    });
  });
}

function buildMessages(payload) {
  const observations = (payload.observations || [])
    .map((o) => (o.card ? '- ' + o.text + ' [' + o.card + ']' : '- ' + o.text))
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
      'Authorization': 'Bearer ' + DEEPSEEK_API_KEY
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

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders());
      res.end();
      return;
    }
    if (req.method !== 'POST') {
      json(res, 405, { error: 'Method not allowed' });
      return;
    }
    if (!DEEPSEEK_API_KEY) {
      json(res, 503, { error: 'DEEPSEEK_API_KEY is not set in this deployment.' });
      return;
    }
    if (isRateLimited(getClientIp(req))) {
      json(res, 429, { error: 'Too many requests. Please try again in a few minutes.' });
      return;
    }
    const payload = await readBody(req);
    const result = await callDeepSeek(payload);
    json(res, 200, result);
  } catch (err) {
    console.error('[api/review]', err.message);
    json(res, 500, { error: 'Server error: ' + err.message });
  }
};
