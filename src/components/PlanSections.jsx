/* The 14 sections of the mentor plan. */

function Section({ num, title, children }) {
  return (
    <div className="card sec">
      <div className="num">SECTION {num}</div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const impactClass = (v) => (v === 'High' ? 'hi' : v === 'Medium' ? 'mid' : 'lo');
const difficultyClass = (v) => (v === 'Low' ? 'hi' : v === 'Medium' ? 'mid' : 'lo');

function List({ items }) {
  return (
    <ul>
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}

export default function PlanSections({ team, plan, onJudge }) {
  const d = plan.domain;

  return (
    <div className="sections">
      <Section num="1" title="Problem Understanding">
        <p>
          In simple words: <strong>{d.plain}</strong>.
        </p>
        <p>
          Your problem statement falls under <strong>{d.label}</strong>. The real job here is
          not to build software — it is to make sure the right person gets {d.actionThing} at
          the right moment. Everything you build should serve that one sentence.
        </p>
      </Section>

      <Section num="2" title="Users & Stakeholders">
        <div className="persona">
          <div className="mini">
            <div className="k">PRIMARY USER</div>
            <div className="v">{d.primary}</div>
            <div className="s">{d.primaryWhy}</div>
          </div>
          <div className="mini">
            <div className="k">SECONDARY USER</div>
            <div className="v">{d.secondary}</div>
            <div className="s">{d.secondaryWhy}</div>
          </div>
          <div className="mini">
            <div className="k">STAKEHOLDERS</div>
            <div className="v" style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.55 }}>
              {d.stakeholders}
            </div>
          </div>
        </div>
      </Section>

      <Section num="3" title="Design Thinking — Problem Definition">
        <div className="pitchbox">How might we {d.hmw}?</div>
      </Section>

      <Section num="4" title="Solution Ideas">
        <div className="ideas">
          {plan.ideas.map((idea, i) => (
            <div key={i} className={i === plan.chosenIndex ? 'idea best' : 'idea'}>
              <div className="num">IDEA {i + 1}</div>
              <h4>{idea.name}</h4>
              <p>{idea.desc}</p>
              <div className="pills">
                <span className={'pill ' + impactClass(idea.impact)}>{idea.impact} Impact</span>
                <span className={'pill ' + difficultyClass(idea.difficulty)}>
                  {idea.difficulty} Difficulty
                </span>
                <span className={'pill ' + impactClass(idea.feasibility)}>
                  {idea.feasibility} Feasibility
                </span>
                <span className="pill">MVP: {idea.complexity}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section num="5" title="Recommended Solution">
        <div className="pitchbox">
          <strong>{plan.chosen.name}</strong>
          <br />
          {plan.why}
        </div>
      </Section>

      <Section num="6" title="MVP Generator">
        <div className="mvp">
          <div className="box must">
            <h5>MUST BUILD</h5>
            <List items={plan.must} />
          </div>
          <div className="box should">
            <h5>SHOULD BUILD</h5>
            <List items={plan.should} />
          </div>
          <div className="box nice">
            <h5>NICE TO HAVE (LATER)</h5>
            <List items={plan.nice} />
          </div>
        </div>
      </Section>

      <div className="card sec">
        <div className="num">SECTION 7</div>
        <h3>Scope Guardian</h3>
        <div className={'scope ' + plan.risk} style={{ marginTop: 12 }}>
          <div className="lvl">⚠ SCOPE RISK: {plan.risk}</div>
          <p style={{ margin: '10px 0 0', lineHeight: 1.65, fontSize: 14.5 }}>{plan.scopeMsg}</p>
          {plan.flags.length > 0 && (
            <p style={{ margin: '12px 0 0', fontSize: 13.5, color: 'var(--amber)' }}>
              Detected in your problem statement: <strong>{plan.flags.join(', ')}</strong> — treat
              these as future scope, not as today&apos;s build.
            </p>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 12 }}>
          Do not attempt today: {plan.avoid.join(' · ')}
        </p>
      </div>

      <Section num="8" title="Technology Recommendation">
        <List items={plan.tech} />
        <p>{plan.techWhy}</p>
      </Section>

      <Section num="9" title={'Build Plan — ' + team.timeLabel + ' remaining'}>
        <div className="timeline">
          {plan.timeline.map((x, i) => (
            <div className="tl" key={i}>
              <b>{x.range}</b>
              <span>{x.task}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section num="10" title="Assumptions">
        <List items={plan.assumptions} />
      </Section>

      <Section num="11" title="Risks">
        <List items={plan.risks} />
      </Section>

      <Section num="12" title="Validation Plan">
        <table className="vt">
          <tbody>
            <tr>
              <th>WHAT TO TEST</th>
              <th>HOW TO TEST IT</th>
              <th>SUCCESS METRIC</th>
            </tr>
            {plan.validation.map((v, i) => (
              <tr key={i}>
                <td>{v.what}</td>
                <td>{v.how}</td>
                <td>{v.metric}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section num="13" title="Demo Plan">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {plan.demoPlan.map((s, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <span style={{ color: 'var(--violet)', fontWeight: 700 }}>{i + 1}.</span> {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section num="14" title="Jury Pitch">
        <List items={plan.pitch} />
        <div className="eyebrow" style={{ marginTop: 18 }}>
          SAMPLE PITCH — READ THIS OUT LOUD
        </div>
        <div className="pitchbox">{plan.samplePitch}</div>
        <button className="btn small" style={{ marginTop: 16 }} onClick={onJudge}>
          ⚖ Now test it in Judge Mode
        </button>
      </Section>
    </div>
  );
}
