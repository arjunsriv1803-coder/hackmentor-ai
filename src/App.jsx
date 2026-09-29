import { useCallback, useEffect, useState } from 'react';
import Background from './components/Background.jsx';
import TopBar from './components/TopBar.jsx';
import Home from './components/Home.jsx';
import Intake from './components/Intake.jsx';
import Dashboard from './components/Dashboard.jsx';
import JudgeMode from './components/JudgeMode.jsx';
import MentorView from './components/MentorView.jsx';
import OrganiserView from './components/OrganiserView.jsx';
import { buildPlan, timeLabel } from './lib/planEngine.js';
import { saveTeamToRegistry } from './lib/org.js';
import { clearOrgData } from './lib/storage.js';
import { checkHealth } from './lib/api.js';

const SCREENS = ['home', 'intake', 'dashboard', 'judge', 'mentorView', 'orgView'];

const EMPTY_FORM = {
  name: '',
  problem: '',
  size: 4,
  experience: 'Beginner',
  skills: [],
  minutes: 60
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [form, setForm] = useState(EMPTY_FORM);
  const [team, setTeam] = useState(null);
  const [plan, setPlan] = useState(null);
  const [aiLive, setAiLive] = useState(false);
  const [busy, setBusy] = useState(false);

  /* Is the real AI reachable? */
  useEffect(() => {
    checkHealth().then((d) => setAiLive(Boolean(d.live)));
  }, []);

  /* Navigation. Every screen gets its own browser history entry, so the Back
     button moves between screens instead of leaving the site. */
  const show = useCallback(
    (next, fromHistory) => {
      let target = SCREENS.includes(next) ? next : 'home';
      // opening the dashboard or judge mode without a plan sends you to the form
      if ((target === 'dashboard' || target === 'judge') && !plan) target = 'intake';
      setScreen(target);
      if (fromHistory) return;
      if (window.history.state && window.history.state.screen === target) return;
      try {
        window.history.pushState({ screen: target }, '', '#' + target);
      } catch {
        /* ignore */
      }
    },
    [plan]
  );

  useEffect(() => {
    const onPop = (e) => {
      const s = (e.state && e.state.screen) || (location.hash ? location.hash.slice(1) : 'home');
      show(s, true);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [show]);

  /* Give the first screen a history entry, and honour a #screen in the address bar. */
  useEffect(() => {
    const start = location.hash ? location.hash.slice(1) : 'home';
    try {
      window.history.replaceState({ screen: 'home' }, '', '#home');
    } catch {
      /* ignore */
    }
    if (SCREENS.includes(start) && start !== 'home') show(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = () => {
    const minutes = Number(form.minutes);
    const nextTeam = {
      name: form.name.trim() || 'Your Team',
      problem: form.problem.trim(),
      size: Math.max(1, Math.min(20, parseInt(form.size, 10) || 4)),
      experience: form.experience,
      skills: form.skills.slice(),
      minutes,
      timeLabel: timeLabel(minutes)
    };
    const nextPlan = buildPlan(nextTeam);
    setTeam(nextTeam);
    setPlan(nextPlan);
    saveTeamToRegistry(nextTeam, nextPlan);
    setScreen('dashboard');
    try {
      window.history.pushState({ screen: 'dashboard' }, '', '#dashboard');
    } catch {
      /* ignore */
    }
  };

  const resetDemo = () => {
    setTeam(null);
    setPlan(null);
    setForm(EMPTY_FORM);
    setBusy(false);
    clearOrgData();
    show('home');
  };

  return (
    <>
      <Background />
      <TopBar aiLive={aiLive} onGo={show} onReset={resetDemo} />
      <div className="wrap">
        {screen === 'home' && <Home onGo={show} />}
        {screen === 'intake' && (
          <Intake form={form} setForm={setForm} onGenerate={generate} onGo={show} />
        )}
        {screen === 'dashboard' && plan && (
          <Dashboard
            team={team}
            plan={plan}
            aiLive={aiLive}
            setAiLive={setAiLive}
            busy={busy}
            setBusy={setBusy}
            onGo={show}
          />
        )}
        {screen === 'judge' && plan && (
          <JudgeMode
            team={team}
            plan={plan}
            setAiLive={setAiLive}
            busy={busy}
            setBusy={setBusy}
            onGo={show}
          />
        )}
        {screen === 'mentorView' && <MentorView team={team} plan={plan} onGo={show} />}
        {screen === 'orgView' && <OrganiserView onGo={show} />}
      </div>
    </>
  );
}
