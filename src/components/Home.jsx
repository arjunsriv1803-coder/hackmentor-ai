const ROLES = [
  {
    screen: 'intake',
    primary: true,
    icon: '🚀',
    title: 'Hackathon Team',
    body:
      'Enter your problem statement and team context. Get a complete mentor plan: ' +
      'problem understanding, users, ideas, MVP, scope warning, technology, demo plan ' +
      'and jury pitch — plus a live AI mentor chat.',
    cta: 'Start mentoring session →'
  },
  {
    screen: 'mentorView',
    icon: '🧭',
    title: 'Human Mentor',
    body:
      'A one-glance summary of a team: problem, solution, MVP, technology, risks, ' +
      'progress and the single next step you should push them towards.',
    cta: 'Open mentor dashboard →'
  },
  {
    screen: 'orgView',
    icon: '🛰️',
    title: 'Organising Committee',
    body:
      'See every team at once: who is active, who is stuck, common blockers, scope risk ' +
      'and where a human mentor is actually needed.',
    cta: 'Open organiser dashboard →'
  }
];

const TAGS = ['ROLE AWARE', 'TIME AWARE', 'SCOPE GUARDIAN', 'JURY MODE', 'OFFLINE FALLBACK'];

export default function Home({ onGo }) {
  return (
    <section className="screen active">
      <div className="hero">
        <h1>HackMentor AI</h1>
        <p className="sub">Your AI mentor from problem statement to final pitch.</p>
        <p className="exp">
          Turn any hackathon problem into a focused, realistic and presentation-ready MVP.
          HackMentor AI is time-aware, skill-aware and scope-aware — it does not just answer
          questions, it walks your team through the entire hackathon journey.
        </p>
        <div className="badgeline">
          {TAGS.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="roles">
        {ROLES.map((r) => (
          <div
            key={r.screen}
            className={r.primary ? 'role primary' : 'role'}
            role="button"
            tabIndex={0}
            onClick={() => onGo(r.screen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onGo(r.screen);
              }
            }}
          >
            <span className="icon">{r.icon}</span>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
            <div className="go">{r.cta}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <div className="eyebrow">WHY THIS IS NOT JUST CHATGPT IN A WEBSITE</div>
        <p className="muted" style={{ lineHeight: 1.7, margin: 0, fontSize: 14.5 }}>
          General-purpose AI gives answers.{' '}
          <strong style={{ color: '#fff' }}>
            HackMentor AI provides a structured, time-aware and skill-aware mentoring journey
            designed specifically for hackathons
          </strong>{' '}
          — it knows your team has 4 beginners and 47 minutes left, so it removes features
          instead of adding them.
        </p>
      </div>
    </section>
  );
}
