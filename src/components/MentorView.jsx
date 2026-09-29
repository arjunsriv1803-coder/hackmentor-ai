import { useState } from 'react';
import { buildPlan } from '../lib/planEngine.js';

const SAMPLE_TEAM = {
  name: 'Team Phoenix',
  problem: 'Reduce food wastage in college canteens using technology.',
  experience: 'Beginner',
  skills: ['HTML/CSS'],
  size: 4,
  minutes: 180,
  timeLabel: '3 Hours'
};

function Block({ title, children }) {
  return (
    <div className="card">
      <div className="eyebrow">{title}</div>
      {children}
    </div>
  );
}

const listStyle = { margin: 0, paddingLeft: 18, lineHeight: 1.7, color: 'var(--ink-dim)' };

export default function MentorView({ team, plan, onGo }) {
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState('');

  const live = Boolean(plan);
  const t = live ? team : SAMPLE_TEAM;
  const p = live ? plan : buildPlan(SAMPLE_TEAM);
  const progress = 65;
  const riskClass = p.risk === 'HIGH' ? 'riskhi' : p.risk === 'MEDIUM' ? 'riskmid' : 'risklo';

  return (
    <section className="screen active">
      <div className="secbar">
        <button className="navbtn" onClick={() => onGo('home')}>
          ← Home
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <div className="eyebrow">HUMAN MENTOR VIEW</div>
          <h2 style={{ fontSize: 26 }}>{t.name}</h2>
        </div>
        <div className="spacer" />
        <span className="samplebadge" style={{ color: live ? 'var(--good)' : 'var(--amber)' }}>
          {live ? 'LIVE TEAM DATA' : 'SAMPLE DATA'}
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Block title="PROBLEM">
          <p style={{ margin: 0, lineHeight: 1.65, color: 'var(--ink-dim)' }}>{t.problem}</p>
        </Block>
        <Block title="SELECTED SOLUTION">
          <p style={{ margin: 0, lineHeight: 1.65, color: 'var(--ink-dim)' }}>
            <strong>{p.chosen.name}</strong>
            <br />
            {p.chosen.desc}
          </p>
        </Block>
        <Block title="CURRENT MVP">
          <ul style={listStyle}>
            {p.must.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Block>
        <Block title="TECHNOLOGY">
          <ul style={listStyle}>
            {p.tech.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Block>
        <Block title="ASSUMPTIONS">
          <ul style={listStyle}>
            {p.assumptions.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Block>
        <Block title="RISKS">
          <ul style={listStyle}>
            {p.risks.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Block>
        <Block title="PROGRESS & CONTEXT">
          <p style={{ margin: '0 0 10px', color: 'var(--ink-dim)' }}>
            {t.experience} • {t.size} members • {t.timeLabel} remaining • Scope risk{' '}
            <strong className={riskClass}>{p.risk}</strong>
          </p>
          <div className="bar">
            <i style={{ width: progress + '%' }} />
          </div>
          <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
            {progress}% of planned MVP complete
          </div>
        </Block>
        <Block title="RECOMMENDED NEXT STEP">
          <p style={{ margin: 0, lineHeight: 1.65, color: 'var(--ink-dim)' }}>
            Complete &quot;{p.must[0]}&quot; end-to-end before adding anything else. {p.scopeMsg}
          </p>
        </Block>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="eyebrow">MENTOR FEEDBACK</div>
        <textarea
          placeholder="Write feedback for this team…"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          className="btn small"
          style={{ marginTop: 12 }}
          onClick={() => {
            setSent(true);
            setTimeout(() => setSent(false), 4000);
          }}
        >
          Send Feedback
        </button>
        {sent && (
          <div className="muted" style={{ marginTop: 10 }}>
            ✓ Feedback recorded (demo prototype — not stored on a server).
          </div>
        )}
      </div>
    </section>
  );
}
