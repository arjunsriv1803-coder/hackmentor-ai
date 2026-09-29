/* ============================================================
   HackMentor AI  -  tiny backend server
   ------------------------------------------------------------
   What this file does:
   1. Serves index.html (the whole website)
   2. Keeps the API key SECRET on the server (never sent to browser)
   3. Talks to a real LLM API and returns the answer to the chat
   No libraries needed. Just run:  node server.js
   ============================================================ */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ---------- 1. Read the secret key from the .env file ---------- */
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const text = line.trim();
    if (!text || text.startsWith('#')) continue;
    const eq = text.indexOf('=');
    if (eq === -1) continue;
    const key = text.slice(0, eq).trim();
    let value = text.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvFile();

/* ---------- 2. Figure out which AI provider we can use ---------- */
// A key only counts if it looks real (not the placeholder text).
function realKey(value) {
  if (!value) return null;
  const v = value.trim();
  if (v.length < 20) return null;
  if (/paste|your_|xxxx|here/i.test(v)) return null;
  return v;
}

const ANTHROPIC_KEY = realKey(process.env.ANTHROPIC_API_KEY);
const OPENAI_KEY = realKey(process.env.OPENAI_API_KEY);
const GEMINI_KEY = realKey(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

const PROVIDER =
  ANTHROPIC_KEY ? 'anthropic' :
  OPENAI_KEY ? 'openai' :
  GEMINI_KEY ? 'gemini' : 'none';

// If one model name is not available on the account, we quietly try the next one.
const MODELS = {
  anthropic: [process.env.MODEL, 'claude-sonnet-4-5', 'claude-3-5-sonnet-latest'].filter(Boolean),
  openai: [process.env.MODEL, 'gpt-4o-mini', 'gpt-4.1-mini'].filter(Boolean),
  gemini: [process.env.MODEL, 'gemini-flash-latest', 'gemini-3.6-flash', 'gemini-2.0-flash'].filter(Boolean)
};

const PORT = Number(process.env.PORT) || 3000;

/* ---------- 3. The mentor personality (system prompt) ---------- */
function buildSystemPrompt(context, mode) {
  const c = context || {};
  const teamBlock = [
    'TEAM CONTEXT (always use this, never ignore it):',
    '- Team name: ' + (c.teamName || 'Unknown'),
    '- Team size: ' + (c.teamSize || '?') + ' members',
    '- Experience level: ' + (c.experience || 'Beginner'),
    '- Skills: ' + ((c.skills && c.skills.length) ? c.skills.join(', ') : 'Not stated'),
    '- Time remaining in hackathon: ' + (c.timeLabel || 'Unknown'),
    '- Problem statement: ' + (c.problem || 'Not provided'),
    '- Recommended solution so far: ' + (c.recommended || 'Not chosen yet'),
    '- Current MVP (must build): ' + ((c.mvp && c.mvp.length) ? c.mvp.join('; ') : 'Not defined yet'),
    '- Technology plan: ' + ((c.tech && c.tech.length) ? c.tech.join(', ') : 'Not decided'),
    '- Key risks: ' + ((c.risks && c.risks.length) ? c.risks.join('; ') : 'Not listed')
  ].join('\n');

  const mentor =
    'You are HackMentor AI, an experienced and very practical hackathon mentor.\n' +
    'Your job: help this specific team turn their problem statement into a realistic, working, ' +
    'presentation-ready MVP.\n\n' +
    'Always factor in: remaining time, team skills, experience level, team size, feasibility and demo readiness.\n' +
    'Prefer a small working MVP over an ambitious unfinished one.\n' +
    'Aggressively cut scope when time is short. Never recommend heavy technology (blockchain, model training, ' +
    'microservices, Kubernetes, big databases) unless it is genuinely required and the team has the time and skill.\n' +
    'If the team is beginner level, explain simply and avoid jargon.\n\n' +
    'Style rules:\n' +
    '- Be concise: usually under 130 words.\n' +
    '- Give concrete, actionable steps, not theory.\n' +
    '- Refer to the team\'s real problem statement and their real time remaining. Be specific, never generic.\n' +
    '- Use short bullet points when listing.\n' +
    '- You are HackMentor AI, not a general purpose assistant.';

  const judge =
    'You are acting as a STRICT but fair hackathon judge evaluating this team\'s project.\n' +
    'Ask exactly ONE tough, specific question about their project. Reference their actual problem ' +
    'statement or their chosen solution.\n' +
    'Output ONLY the question, one or two sentences. No preamble, no numbering, no extra text.\n' +
    'Good areas: why AI is needed, how this differs from just using ChatGPT, who the real user is, ' +
    'measurable impact, biggest assumption, biggest risk, scaling, what they actually built today, ' +
    'and why they chose this technology.';

  const judgeEval =
    'You are a strict but encouraging hackathon judge reviewing a team\'s answer to your question.\n' +
    'Reply in exactly this format and nothing else:\n\n' +
    'SCORE: x/10\n' +
    'GOOD: one short line on what worked\n' +
    'MISSING: one short line on what was weak or missing\n' +
    'BETTER ANSWER: a 2 to 3 sentence stronger answer they could actually say to a judge';

  const role = mode === 'judge' ? judge : mode === 'judge-eval' ? judgeEval : mentor;
  return role + '\n\n' + teamBlock;
}

/* ---------- 4. Call the real LLM API ---------- */
async function callLLM(system, messages, model) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000); // give up after 30 seconds
  try {
    if (PROVIDER === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'content-type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({ model: model, max_tokens: 700, system: system, messages: messages })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data && data.error && data.error.message) || ('API error ' + res.status));
      return (data.content || []).map(function (p) { return p.text || ''; }).join('').trim();
    }

    if (PROVIDER === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + OPENAI_KEY },
        body: JSON.stringify({
          model: model,
          max_tokens: 700,
          messages: [{ role: 'system', content: system }].concat(messages)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data && data.error && data.error.message) || ('API error ' + res.status));
      return ((data.choices && data.choices[0] && data.choices[0].message.content) || '').trim();
    }

    if (PROVIDER === 'gemini') {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        model + ':generateContent?key=' + GEMINI_KEY;
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map(function (m) {
            return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
          })
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data && data.error && data.error.message) || ('API error ' + res.status));
      const cand = data.candidates && data.candidates[0];
      const parts = (cand && cand.content && cand.content.parts) || [];
      return parts.map(function (p) { return p.text || ''; }).join('').trim();
    }

    throw new Error('No API key configured');
  } finally {
    clearTimeout(timer);
  }
}

/* Google gives every account a different list of models, so instead of guessing
   we ask Google once which models this key can actually use. */
let geminiModelCache = null; // list of model names, filled on first use
async function listGeminiModels() {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + GEMINI_KEY);
  const data = await res.json();
  if (!res.ok) throw new Error((data && data.error && data.error.message) || 'Could not list models');
  return (data.models || [])
    .filter(function (m) { return (m.supportedGenerationMethods || []).indexOf('generateContent') !== -1; })
    .map(function (m) { return String(m.name).replace('models/', ''); });
}

// Try each model name until one works.
async function askLLM(system, messages) {
  let list = MODELS[PROVIDER] || [];

  if (PROVIDER === 'gemini' && !geminiModelCache) {
    try {
      const available = await listGeminiModels();
      // Skip the special-purpose models (images, speech, robotics, research...)
      const good = available.filter(function (n) {
        return /flash|pro/.test(n) &&
          !/vision|image|audio|live|tts|embed|thinking|learnlm|robotics|computer-use|research|banana|lyria|omni|customtools/.test(n);
      });
      // Highest version number first, e.g. gemini-3.7-flash beats gemini-2.5-flash.
      const numbered = good.filter(function (n) { return /^gemini-[\d.]+-flash$/.test(n); })
        .sort(function (a, b) {
          return parseFloat(b.split('-')[1]) - parseFloat(a.split('-')[1]);
        });
      // Build a short list of backups, so a busy model never breaks the chat.
      const ordered = [];
      good.concat(numbered, available).forEach(function (n) {
        if (n === 'gemini-flash-latest' && ordered.indexOf(n) === -1) ordered.unshift(n);
      });
      numbered.concat(good).forEach(function (n) {
        if (ordered.indexOf(n) === -1) ordered.push(n);
      });
      geminiModelCache = ordered.slice(0, 4);
      if (geminiModelCache.length) console.log('[HackMentor] Gemini models to use: ' + geminiModelCache.join(', '));
    } catch (e) {
      console.log('[HackMentor] could not list Gemini models: ' + e.message);
    }
  }
  if (geminiModelCache && geminiModelCache.length) {
    list = geminiModelCache.concat(list).filter(function (n, i, a) { return a.indexOf(n) === i; });
  }

  const attempts = [];
  for (const model of list) {
    try {
      const text = await callLLM(system, messages, model);
      if (text) return { text: text, model: model };
      attempts.push(model + ': empty response');
    } catch (err) {
      const msg = String(err.message || 'failed');
      attempts.push(model + ': ' + msg);
      console.log('[HackMentor] tried ' + model + ' -> ' + msg);
      // Only try the next model name if this one simply does not exist for this account.
      if (!/not_found|not found|does not exist|404|no longer available|high demand|overload|unavailable|try again later|rate limit|429|503/i.test(msg)) break;
    }
  }
  throw new Error(attempts.join('  ||  ') || 'No API key configured');
}

/* ---------- 5. The web server ---------- */
function sendJson(res, code, obj) {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(function (req, res) {
  // Health check: the website uses this to show AI ONLINE / OFFLINE
  if (req.url === '/api/health') {
    return sendJson(res, 200, { live: PROVIDER !== 'none', provider: PROVIDER });
  }


  // The chat endpoint (this is where the real AI happens)
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', function (chunk) {
      body += chunk;
      if (body.length > 200000) req.destroy();
    });
    req.on('end', async function () {
      try {
        const payload = JSON.parse(body || '{}');
        if (PROVIDER === 'none') {
          return sendJson(res, 200, { ok: false, error: 'No API key configured on the server.' });
        }
        const system = buildSystemPrompt(payload.context, payload.mode);
        const messages = (payload.messages || [])
          .filter(function (m) { return m && m.content; })
          .slice(-12) // keep only the last few turns
          .map(function (m) {
            return { role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content) };
          });
        if (!messages.length) return sendJson(res, 200, { ok: false, error: 'No message sent.' });

        const result = await askLLM(system, messages);
        console.log('[HackMentor] real AI reply via ' + PROVIDER + ' / ' + result.model);
        return sendJson(res, 200, { ok: true, reply: result.text, provider: PROVIDER, model: result.model });
      } catch (err) {
        var why = err.message || 'AI request failed';
        console.log('[HackMentor] AI call failed: ' + why);
        // "Busy" means the free tier is rate limited or the model is overloaded.
        // We tell the browser how long to wait so it can retry instead of giving up.
        var busy = /quota|rate limit|429|high demand|overload|try again later/i.test(why);
        var stated = why.match(/retry in ([\d.]+)\s*s/i);
        return sendJson(res, 200, {
          ok: false,
          error: why,
          kind: busy ? 'busy' : 'error',
          retryAfter: stated ? Math.ceil(parseFloat(stated[1])) : (busy ? 15 : 0)
        });
      }
    });
    return;
  }

  // Anything else: serve the built React app out of the dist folder.
  var TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
  };
  var dist = path.join(__dirname, 'dist');
  var wanted = decodeURIComponent((req.url || '/').split('?')[0]);
  var file = path.join(dist, wanted);

  // never serve anything outside dist
  if (file.indexOf(dist) !== 0) file = path.join(dist, 'index.html');

  fs.stat(file, function (err, stat) {
    // unknown path or a folder: fall back to index.html (single page app)
    if (err || stat.isDirectory()) file = path.join(dist, 'index.html');
    fs.readFile(file, function (err2, data) {
      if (err2) {
        res.writeHead(500, { 'content-type': 'text/plain' });
        return res.end('The app has not been built yet. Run:  npm run build');
      }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  });
});

server.listen(PORT, function () {
  console.log('');
  console.log('  HackMentor AI is running');
  console.log('  Open this in your browser:  http://localhost:' + PORT);
  console.log('  AI provider: ' + (PROVIDER === 'none'
    ? 'NONE  (chat will run in Offline Mentor Mode)'
    : PROVIDER.toUpperCase() + '  (real AI enabled)'));
  console.log('');
});
