import { useState } from 'react';
import { MENTOR_POOL, PROBLEM_BANK } from '../lib/orgData.js';
import {
  allTeams,
  buildGroups,
  setMentor,
  autoAssign,
  getLogistics,
  toggleLogi,
  setProblem,
  teamProblemCode,
  getFeed,
  postMessage
} from '../lib/org.js';
import { clearOrgData } from '../lib/storage.js';

const TABS = [
  ['teams', 'TEAM REGISTRY'],
  ['groups', 'GROUPS & MENTORS'],
  ['problems', 'PROBLEM DISTRIBUTION'],
  ['logistics', 'LOGISTICS'],
  ['comms', 'COMMUNICATION']
];

const riskClass = (r) => (r === 'HIGH' ? 'riskhi' : r === 'MEDIUM' ? 'riskmid' : 'risklo');

export default function OrganiserView({ onGo }) {
  const [tab, setTab] = useState('teams');
  const [announcement, setAnnouncement] = useState('');
  const [version, setVersion] = useState(0); // bumped to re-read localStorage
  const refresh = () => setVersion((v) => v + 1);

  const teams = allTeams();
  const groups = buildGroups();
  const logistics = getLogistics();
  const feed = getFeed();

  const live = teams.filter((t) => !t.sample).length;
  const needHelp = teams.filter((t) => t.risk === 'HIGH').length;
  const done = logistics.filter((x) => x.done).length;
  const unassigned = groups.filter((g) => g.mentor === 'Unassigned').length;

  const send = () => {
    if (!announcement.trim()) return;
    postMessage('Organising Committee', announcement.trim(), 'org');
    setAnnouncement('');
    refresh();
  };

  return (
    <section className="screen active" key={version}>
      <div className="secbar">
        <button className="navbtn" onClick={() => onGo('home')}>
          ← Home
        </button>
        <button
          className="navbtn"
          onClick={() => {
            autoAssign();
            refresh();
          }}
        >
          ⚡ Auto-assign mentors
        </button>
        <button
          className="navbtn"
          onClick={() => {
            clearOrgData();
            refresh();
          }}
        >
          Reset organiser data
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <div className="eyebrow">ORGANISING COMMITTEE CONTROL ROOM</div>
          <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.03em' }}>
            Event Command Centre
          </h2>
        </div>
        <div className="spacer" />
        <span className="samplebadge" style={{ color: live ? 'var(--good)' : 'var(--amber)' }}>
          {live ? `${live} LIVE TEAM${live > 1 ? 'S' : ''} + SAMPLE DATA` : 'SAMPLE DATA'}
        </span>
      </div>

      <div className="stats" style={{ marginBottom: 18 }}>
        <div className="stat">
          <b>{teams.length}</b>
          <span>TEAMS REGISTERED</span>
        </div>
        <div className="stat">
          <b>{live}</b>
          <span>LIVE FROM INTAKE</span>
        </div>
        <div className="stat">
          <b>{groups.length}</b>
          <span>GROUPS FORMED</span>
        </div>
        <div className="stat">
          <b>{needHelp}</b>
          <span>NEED HELP</span>
        </div>
        <div className="stat">
          <b>
            {done}/{logistics.length}
          </b>
          <span>LOGISTICS DONE</span>
        </div>
      </div>

      <div className="otabs">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? 'otab on' : 'otab'}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'teams' && (
        <div className="card">
          <div className="eyebrow">EVERY REGISTERED TEAM</div>
          <p className="muted" style={{ margin: '0 0 6px', fontSize: 13 }}>
            Teams that complete the Hackathon Team intake are saved here automatically and marked
            LIVE.
          </p>
          <table className="tt">
            <tbody>
              <tr>
                <th>TEAM</th>
                <th>SOURCE</th>
                <th>TRACK</th>
                <th>LEVEL</th>
                <th>PS</th>
                <th>PROGRESS</th>
                <th>RISK</th>
                <th>ISSUE</th>
              </tr>
              {teams.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>
                    <span className={t.sample ? 'tagl' : 'tagl live'}>
                      {t.sample ? 'SAMPLE' : 'LIVE'}
                    </span>
                  </td>
                  <td>{t.domain}</td>
                  <td>{t.experience}</td>
                  <td>{teamProblemCode(t) || '—'}</td>
                  <td>
                    <div className="bar">
                      <i style={{ width: t.progress + '%' }} />
                    </div>
                    {t.progress}%
                  </td>
                  <td className={riskClass(t.risk)}>{t.risk}</td>
                  <td>{t.issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'groups' && (
        <div className="card">
          <div className="eyebrow">
            TEAMS SPLIT INTO GROUPS · {groups.length} GROUPS · {unassigned} WITHOUT A MENTOR
          </div>
          <p className="muted" style={{ margin: '0 0 16px', fontSize: 13 }}>
            Teams are grouped by the problem track they are solving, so one mentor covers similar
            problems.
          </p>
          {groups.map((g) => (
            <div className="gcard" key={g.id}>
              <div className="grow">
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h4>
                    {g.id} · {g.track}
                  </h4>
                  <div className="muted" style={{ fontSize: 12.5 }}>
                    {g.teams.length} team(s)
                  </div>
                </div>
                <div>
                  <div className="gk">ASSIGNED MENTOR</div>
                  <select
                    className="gsel"
                    value={g.mentor}
                    onChange={(e) => {
                      setMentor(g.track, e.target.value);
                      refresh();
                    }}
                  >
                    {MENTOR_POOL.map((m) => (
                      <option key={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {g.teams.map((t) => (
                <div className="trow" key={t.id}>
                  <span className={t.sample ? 'tagl' : 'tagl live'}>
                    {t.sample ? 'SAMPLE' : 'LIVE'}
                  </span>
                  <span style={{ flex: 1 }}>{t.name}</span>
                  <span className={riskClass(t.risk)}>{t.risk}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'problems' && (
        <div className="card">
          <div className="eyebrow">PROBLEM STATEMENT DISTRIBUTION</div>
          <p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>
            Give every team an official problem statement code. Changes save instantly.
          </p>
          <table className="tt">
            <tbody>
              <tr>
                <th>TEAM</th>
                <th>CURRENT PROBLEM</th>
                <th>ASSIGNED STATEMENT</th>
              </tr>
              {teams.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td style={{ maxWidth: 280 }}>{String(t.problem).slice(0, 70)}</td>
                  <td>
                    <select
                      className="gsel"
                      value={teamProblemCode(t)}
                      onChange={(e) => {
                        setProblem(t.id, e.target.value);
                        refresh();
                      }}
                    >
                      <option value="">— not assigned —</option>
                      {PROBLEM_BANK.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.code} · {p.title}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'logistics' && (
        <div className="card">
          <div className="eyebrow">
            EVENT LOGISTICS · {done} OF {logistics.length} COMPLETE
          </div>
          <div className="bar" style={{ margin: '0 0 16px' }}>
            <i style={{ width: Math.round((done / logistics.length) * 100) + '%' }} />
          </div>
          {logistics.map((x, i) => (
            <button
              type="button"
              className={x.done ? 'logi done' : 'logi'}
              key={i}
              onClick={() => {
                toggleLogi(i);
                refresh();
              }}
            >
              <div className="bx">{x.done ? '✓' : ''}</div>
              <span>{x.task}</span>
            </button>
          ))}
        </div>
      )}

      {tab === 'comms' && (
        <div className="card">
          <div className="eyebrow">BROADCAST TO ALL TEAMS</div>
          <textarea
            placeholder="e.g. Submissions close in 30 minutes. Upload your demo link now."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
          <button className="btn small" style={{ marginTop: 12 }} onClick={send}>
            Send Announcement
          </button>
          <div className="hr" />
          <div className="eyebrow">MESSAGE FEED · TEAM REQUESTS APPEAR HERE</div>
          <div className="feed">
            {!feed.length && (
              <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                No messages yet. Teams can press “Request Mentor” on their dashboard and it will
                appear here instantly.
              </p>
            )}
            {feed.map((m, i) => (
              <div className={'fmsg ' + m.kind} key={i}>
                <div className="fh">
                  {m.from} · {m.time}
                </div>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
