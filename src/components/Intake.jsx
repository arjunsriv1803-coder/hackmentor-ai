import { useState } from 'react';

const SKILLS = [
  'HTML/CSS',
  'JavaScript',
  'Python',
  'AI/ML',
  'UI/UX',
  'Backend',
  'Database',
  'No Technical Skills'
];

const TIMES = [
  [60, '1 Hour'],
  [180, '3 Hours'],
  [360, '6 Hours'],
  [720, '12 Hours'],
  [1440, '24 Hours'],
  [2880, '48 Hours']
];

const DEMO = {
  name: 'Team Phoenix',
  problem: 'Reduce food wastage in college canteens using technology.',
  size: 4,
  experience: 'Beginner',
  skills: ['HTML/CSS'],
  minutes: 60
};

export default function Intake({ form, setForm, onGenerate, onGo }) {
  const [error, setError] = useState('');

  const set = (patch) => setForm({ ...form, ...patch });

  const toggleSkill = (s) => {
    const has = form.skills.includes(s);
    set({ skills: has ? form.skills.filter((x) => x !== s) : form.skills.concat(s) });
  };

  const submit = () => {
    if (!form.problem.trim()) {
      setError('Please enter your problem statement before generating a mentor plan.');
      return;
    }
    setError('');
    onGenerate();
  };

  return (
    <section className="screen active">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
          flexWrap: 'wrap'
        }}
      >
        <button className="navbtn" onClick={() => onGo('home')}>
          ← Back
        </button>
        <div>
          <div className="eyebrow" style={{ margin: 0 }}>
            STEP 1 OF 2 · TEAM INTAKE
          </div>
          <h2 style={{ fontSize: 24 }}>Tell us about your team and your problem</h2>
        </div>
        <div className="spacer" />
        <button
          className="btn ghost small"
          onClick={() => {
            setForm({ ...DEMO });
            setError('');
          }}
        >
          ⚡ Load Demo Problem
        </button>
      </div>

      <div className="card">
        <div className="row2">
          <div className="field">
            <label className="f" htmlFor="teamName">
              TEAM NAME
            </label>
            <input
              id="teamName"
              placeholder="Team Phoenix"
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="f" htmlFor="teamSize">
              TEAM SIZE
            </label>
            <input
              id="teamSize"
              type="number"
              min="1"
              max="20"
              value={form.size}
              onChange={(e) => set({ size: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label className="f" htmlFor="problem">
            PROBLEM STATEMENT
          </label>
          <textarea
            id="problem"
            placeholder="Paste your hackathon problem statement here."
            value={form.problem}
            onChange={(e) => set({ problem: e.target.value })}
          />
        </div>

        <div className="row2">
          <div className="field">
            <label className="f" htmlFor="experience">
              EXPERIENCE LEVEL
            </label>
            <select
              id="experience"
              value={form.experience}
              onChange={(e) => set({ experience: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="field">
            <label className="f" htmlFor="timeLeft">
              TIME REMAINING
            </label>
            <select
              id="timeLeft"
              value={form.minutes}
              onChange={(e) => set({ minutes: Number(e.target.value) })}
            >
              {TIMES.map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="f">SKILLS IN THE TEAM (select all that apply)</label>
          <div className="chips">
            {SKILLS.map((s) => (
              <button
                type="button"
                key={s}
                className={form.skills.includes(s) ? 'chip on' : 'chip'}
                aria-pressed={form.skills.includes(s)}
                onClick={() => toggleSkill(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button className="btn" style={{ width: '100%', marginTop: 6 }} onClick={submit}>
          Generate Mentor Plan
        </button>
        {error && (
          <div className="err" style={{ display: 'block' }}>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
