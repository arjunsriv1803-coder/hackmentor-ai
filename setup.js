/* ============================================================
   HackMentor AI - one-time key setup
   Run this once:   node setup.js
   It asks for your API key and writes the .env file for you.
   ============================================================ */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('');
console.log('  =============================================');
console.log('   HackMentor AI  -  API key setup');
console.log('  =============================================');
console.log('');
console.log('  Paste your API key below, then press Enter.');
console.log('  (Right-click inside the terminal to paste.)');
console.log('');

rl.question('  Your API key: ', function (answer) {
  const key = String(answer).trim().replace(/^["']|["']$/g, '');

  if (key.length < 20) {
    console.log('');
    console.log('  X  That does not look like an API key (it was too short).');
    console.log('     Nothing was saved. Run  node setup.js  again.');
    console.log('');
    rl.close();
    return;
  }

  // Work out which company the key belongs to, just from how it starts.
  let name = 'ANTHROPIC_API_KEY';
  let label = 'Anthropic (Claude)';
  if (/^sk-ant/i.test(key)) { name = 'ANTHROPIC_API_KEY'; label = 'Anthropic (Claude)'; }
  else if (/^AIza/.test(key) || /^AQ\./.test(key)) { name = 'GEMINI_API_KEY'; label = 'Google Gemini'; }
  else if (/^sk-/i.test(key)) { name = 'OPENAI_API_KEY'; label = 'OpenAI'; }
  else { console.log('\n  !  Could not tell which company this key is from - assuming Anthropic.'); }

  const contents =
    '# Written by setup.js - this file holds your SECRET key.\n' +
    '# Never share it, never upload it, never screenshot it.\n\n' +
    name + '=' + key + '\n\n' +
    'PORT=3000\n';

  fs.writeFileSync(path.join(__dirname, '.env'), contents);

  console.log('');
  console.log('  OK  Saved. Detected provider: ' + label);
  console.log('');
  console.log('  Now start the app by typing:   node server.js');
  console.log('');
  rl.close();
});
