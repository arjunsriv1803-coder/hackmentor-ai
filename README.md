# HackMentor AI

**Your AI mentor from problem statement to final pitch.**

An AI mentor for hackathon teams, built with **React**. Paste your problem statement, say how
much time you have left, and it produces a full mentor plan — problem understanding, users,
ideas, a recommended solution, an MVP split, a scope warning, a build timeline, a demo plan and
a jury pitch — plus a live AI chat mentor that knows your team's situation.

It also has dashboards for the other people at a hackathon: a **Human Mentor** view, an
**Organising Committee** control centre (team registry, groups, mentor assignment, logistics,
problem-statement distribution and announcements), and a **Judge Mode** that asks your team hard
questions before the real judges do.

---

## Run it

You need **Node.js**. Everything else installs itself.

**1. Install the packages (once):**

```
npm install
```

**2. Add your AI key (once):**

```
npm run setup
```

Paste your key when it asks, then press Enter.

**3. Start it:**

```
npm start
```

That builds the React app and starts the server. Open <http://localhost:3000>

---

## While you are editing the code

`npm start` rebuilds every time, which is slow while developing. For live reloading use two
terminals:

**Terminal 1 — the API server (holds your key):**

```
npm run server
```

**Terminal 2 — the React dev server with instant reload:**

```
npm run dev
```

Then open <http://localhost:5173>. Changes appear the moment you save.

---

## Getting an API key

Works with **Google Gemini**, OpenAI or Anthropic — `npm run setup` detects which one you have
from the key itself.

For Gemini: <https://aistudio.google.com> → **Get API key**.

Your key is stored in `.env`, which is git-ignored and **never** reaches the browser. Every AI
call goes through `server.js`.

> **Free tier limit:** Google's free Gemini tier allows only a few requests per minute. If you go
> over, the app waits and retries automatically, then falls back to offline mode.

---

## Offline Mentor Mode

If the AI is unavailable — no key, no internet, or rate limited — the app does **not** break. It
shows a notice and answers from a built-in offline mentor instead. The whole mentor plan, judge
mode and both dashboards are generated locally and need no internet at all.

---

## How it is put together

```
index.html            entry point (React mounts into it)
src/
  main.jsx            starts React
  App.jsx             screens, navigation and browser history
  styles.css          the "Command Deck" theme
  fonts.css           the two web fonts, embedded so it works offline
  lib/
    planEngine.js     the rule-based mentor plan (pure logic, no React)
    offlineMentor.js  the fallback mentor used when the AI is unreachable
    org.js            organiser logic: registry, groups, mentors, logistics
    orgData.js        mentor pool, problem bank, sample teams
    api.js            calls to our own backend, with rate-limit retry
    storage.js        safe localStorage helpers
    prompts.js        judge questions and chat suggestions
  components/         one file per screen or panel
server.js             serves the built app and hides the API key
setup.js              one-time key setup helper
```

---

## Built with

React 18 and Vite on the front end. The backend is Node's built-in HTTP server with **no
dependencies** — its only job is to keep the API key off the browser. Organiser data lives in the
browser's `localStorage`, so there is no database to set up.
