# HackMentor AI

**Your AI mentor from problem statement to final pitch.**

An AI mentor for hackathon teams. Paste your problem statement, say how much time you
have left, and it produces a full mentor plan — problem understanding, users, ideas, a
recommended solution, an MVP split, a scope warning, a build timeline, a demo plan and a
jury pitch — plus a live AI chat mentor that knows your team's situation.

It also has dashboards for the other people at a hackathon: a **Human Mentor** view, an
**Organising Committee** control centre (team registry, groups, mentor assignment,
logistics, problem-statement distribution and announcements), and a **Judge Mode** that
asks your team hard questions before the real judges do.

---

## Run it

There is **nothing to install**. You only need Node.js.

1. Open a terminal in this folder.
2. Add your AI key (once):

   ```
   node setup.js
   ```

   Paste your key when it asks, then press Enter.

3. Start it:

   ```
   node server.js
   ```

4. Open <http://localhost:3000>

---

## Getting an API key

This project works with **Google Gemini**, OpenAI or Anthropic — `setup.js` detects
which one you have from the key itself.

For Gemini (what this project was built with): go to
<https://aistudio.google.com> → **Get API key** → create one, then run `node setup.js`
and paste it.

When it starts you should see:

```
AI provider: GEMINI  (real AI enabled)
```

Your key is stored in `.env`, which is listed in `.gitignore` and is **never** committed
or sent to the browser. All AI calls go through `server.js`.

---

## Offline Mentor Mode

If the AI is unavailable — no key, no internet, or the free-tier rate limit is hit — the
app does **not** break. It shows a small notice and answers from a built-in offline
mentor instead. Every other part of the app (the whole mentor plan, judge mode and both
dashboards) is generated locally and needs no internet at all.

> **Note on the free tier:** Google's free Gemini tier allows only a few requests per
> minute. If you go over, the app waits and retries automatically, and falls back to
> offline mode if it still can't get through.

---

## Files

| File | What it does |
|---|---|
| `index.html` | The whole website — every screen, the mentor plan engine, the chat and the offline fallback |
| `server.js` | Small zero-dependency server: serves the page, hides the API key, calls the AI |
| `setup.js` | One-time helper that writes your key into `.env` for you |
| `package.json` | Project name and the `npm start` shortcut |
| `.env` | Your secret key. **Never share or commit this** (already git-ignored) |
| `.env.example` | A safe template showing what `.env` should look like |

---

## Built with

Plain HTML, CSS and JavaScript — no frameworks, no build step, no dependencies. The
backend is Node's built-in HTTP server. Organiser data is stored in the browser's own
`localStorage`, so there is no database to set up. Fonts are bundled into the page, so
the interface renders correctly with no internet connection.
