import { useEffect, useRef, useState } from 'react';
import Markdown from './Markdown.jsx';
import Gauge from './Gauge.jsx';
import { SUGGESTIONS } from '../lib/prompts.js';
import { askAIRetry, buildContext } from '../lib/api.js';
import { offlineMentor } from '../lib/offlineMentor.js';

export default function ChatPanel({ team, plan, aiLive, setAiLive, busy, setBusy }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scroller = useRef(null);

  /* Greet the team as soon as their plan exists. */
  useEffect(() => {
    setMessages([
      {
        who: 'ai',
        text:
          `Hi ${team.name}. I have read your problem statement and I know you are a **` +
          `${team.experience.toLowerCase()}** team of **${team.size}** with **${team.timeLabel}** left.\n\n` +
          `My recommendation right now: build **${plan.chosen.name}** and nothing else until it works.\n\n` +
          'Ask me anything — or tap a suggestion below.'
      }
    ]);
  }, [team, plan]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, typing]);

  const add = (msg) => setMessages((m) => m.concat(msg));

  const send = (textIn) => {
    const text = (textIn ?? draft).trim();
    if (!text || busy) return;
    setDraft('');
    add({ who: 'me', text });
    setTyping(true);
    setBusy(true);

    const history = messages
      .filter((m) => m.who === 'ai' || m.who === 'me')
      .map((m) => ({ role: m.who === 'me' ? 'user' : 'assistant', content: m.text }))
      .concat({ role: 'user', content: text });

    askAIRetry(history, 'mentor', buildContext(team, plan), (secs) =>
      add({ who: 'notice', text: `AI is busy — retrying in ${secs}s…` })
    ).then((res) => {
      setTyping(false);
      setBusy(false);
      if (!res.ok) {
        setAiLive(false);
        add({
          who: 'notice',
          text:
            res.kind === 'busy'
              ? 'AI is rate limited right now — switching to offline mentor mode.'
              : 'AI service unavailable — switching to offline mentor mode.'
        });
        add({ who: 'ai', text: offlineMentor(text, team, plan) });
        return;
      }
      add({ who: 'ai', text: res.reply });
    });
  };

  return (
    <div className="chatwrap">
      <div className="chathead">
        <div className="avatar">🤖</div>
        <div>
          <div className="t">HackMentor AI</div>
          <div className="s">
            <span
              className={aiLive ? 'dot' : 'dot off'}
              style={{ width: 7, height: 7 }}
            />
            <span style={aiLive ? undefined : { color: 'var(--amber)' }}>
              {aiLive ? 'AI MENTOR ONLINE' : 'OFFLINE MENTOR MODE'}
            </span>
          </div>
        </div>
      </div>

      <Gauge risk={plan.risk} timeLabel={team.timeLabel} />

      <div className="msgs" ref={scroller}>
        {messages.map((m, i) =>
          m.who === 'notice' ? (
            <div className="notice" key={i}>
              {m.text}
            </div>
          ) : (
            <div className={'msg ' + (m.who === 'me' ? 'me' : 'ai')} key={i}>
              <Markdown text={m.text} />
            </div>
          )
        )}
        {typing && (
          <div className="typing">
            <i />
            <i />
            <i />
            <span>HackMentor is analysing…</span>
          </div>
        )}
      </div>

      <div className="suggest">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => send(s)} disabled={busy}>
            {s}
          </button>
        ))}
      </div>

      <div className="inputbar">
        <input
          placeholder="Ask your mentor anything…"
          value={draft}
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
        />
        <button className="send" onClick={() => send()} disabled={busy}>
          Send
        </button>
      </div>
    </div>
  );
}
