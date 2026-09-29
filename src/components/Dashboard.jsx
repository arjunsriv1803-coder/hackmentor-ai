import PlanSections from './PlanSections.jsx';
import ChatPanel from './ChatPanel.jsx';
import { latestAnnouncement, postMessage } from '../lib/org.js';
import { useState } from 'react';

export default function Dashboard({ team, plan, aiLive, setAiLive, busy, setBusy, onGo }) {
  const [announcement, setAnnouncement] = useState(() => latestAnnouncement());
  const [helpSent, setHelpSent] = useState(false);

  const metaChips = [
    { text: team.experience, key: true },
    { text: team.size + ' MEMBERS', key: false },
    { text: team.timeLabel + ' LEFT', key: true }
  ].concat(team.skills.map((s) => ({ text: s, key: false })));

  const requestHelp = () => {
    postMessage(
      team.name,
      `Requested a human mentor. Scope risk: ${plan.risk}. Working on: ${plan.chosen.name}.`,
      'team'
    );
    setHelpSent(true);
    setAnnouncement(latestAnnouncement());
  };

  return (
    <section className="screen active">
      <div className="teamhead">
        <div>
          <h2>{team.name}</h2>
          <div className="meta">
            {metaChips.map((c, i) => (
              <span className={c.key ? 'mchip key' : 'mchip'} key={i}>
                {c.text}
              </span>
            ))}
          </div>
        </div>
        <div className="spacer" />
        <button className="btn ghost small" onClick={() => onGo('intake')}>
          ✎ Edit Team
        </button>
        <button className="btn small" onClick={() => onGo('judge')}>
          ⚖ Challenge My Idea
        </button>
        <button className="btn ghost small" onClick={requestHelp}>
          🆘 Request Mentor
        </button>
      </div>

      {helpSent && (
        <div className="announce">
          <div className="fh">REQUEST SENT</div>
          Your request reached the organising committee. A mentor will be assigned to your group
          shortly.
        </div>
      )}

      {announcement && (
        <div className="announce">
          <div className="fh">ANNOUNCEMENT FROM ORGANISERS · {announcement.time}</div>
          {announcement.text}
        </div>
      )}

      <div className="split">
        <PlanSections team={team} plan={plan} onJudge={() => onGo('judge')} />
        <ChatPanel
          team={team}
          plan={plan}
          aiLive={aiLive}
          setAiLive={setAiLive}
          busy={busy}
          setBusy={setBusy}
        />
      </div>
    </section>
  );
}
