# HackMentor AI

Your AI mentor from problem statement to final pitch.

## Run it (nothing to install)

1. Open a terminal in this folder.
2. Type: `node server.js`
3. Open http://localhost:3000 in your browser.

## Turn on the real AI

Open the file `.env` and replace `paste_your_key_here` with your real API key.
Save the file, stop the server (Ctrl + C) and run `node server.js` again.

The terminal will print `AI provider: ANTHROPIC (real AI enabled)` when it worked.

If there is no key, the app still works fully in **Offline Mentor Mode**.

## Files

| File | What it does |
|---|---|
| `index.html` | The whole website: all screens, the mentor plan engine, the chat and the offline fallback |
| `server.js` | Tiny server: serves the page, hides the API key, calls the real LLM |
| `package.json` | Project name and the `npm start` shortcut |
| `.env` | Your SECRET API key. Never share or upload this file |
| `.env.example` | A safe copy showing what `.env` should look like |
| `.gitignore` | Makes sure `.env` is never committed to git |
