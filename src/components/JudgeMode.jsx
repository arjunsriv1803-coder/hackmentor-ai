import { useEffect, useRef, useState } from 'react';
import { LOCAL_JUDGE_Q } from '../lib/prompts.js';
import { askAIRetry, buildContext } from '../lib/api.js';

export default function JudgeMode({ team, plan, setAiLive, busy, setBusy, onGo }) {
  const [question, setQuestion] = useState('Press “Next Question” to begin.');
  const [suggested, setSuggested] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState('');
  const asked = useRef([]);
  const started = useRef(false);

  const context = buildContext(team, plan);

  const nextQuestion = () => {
    if (busy) return;
    setBusy(true);
    setSuggested('');
    setScore('');
    setAnswer('');
    setQuestion('Thinking of a hard question…');

    const prompt =
      'Ask the next judge question. Do not repeat any of these already-asked questions: ' +
      (asked.current.join(' | ') || 'none yet');

    askAIRetry([{ role: 'user', content: prompt }], 'judge', context, (secs) =>
      setQuestion(`AI is busy — retrying in ${secs}s…`)
    ).then((res) => {
      setBusy(false);
      let q;
      if (res.ok && res.reply) {
        q = res.reply.replace(/^["']|["']$/g, '');
      } else {
        setAiLive(false);
        let pool = LOCAL_JUDGE_Q.filter((x) => !asked.current.includes(x));
        if (!pool.length) {
          asked.current = [];
          pool = LOCAL_JUDGE_Q;
        }
        q = pool[Math.floor(Math.random() * pool.length)];
      }
      asked.current.push(q);
      setQuestion(q);
    });
  };

  /* Ask the first question automatically when the screen opens. */
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSuggested = () => {
    if (busy) return;
    setBusy(true);
    setSuggested('Preparing a strong answer…');
    askAIRetry(
      [
        {
          role: 'user',
          content:
            `A judge just asked us: "${question}". Give us the strongest possible 3-sentence ` +
            'answer we can actually say out loud, using our real project details.'
        }
      ],
      'mentor',
      context,
      (secs) => setSuggested(`AI is busy — retrying in ${secs}s…`)
    ).then((res) => {
      setBusy(false);
      if (res.ok && res.reply) {
        setSuggested(res.reply);
        return;
      }
      setAiLive(false);
      setSuggested(
        'Suggested answer (offline mode):\n\n' +
          `Our user is the ${plan.domain.primary.toLowerCase()}, and today ${plan.domain.plain}. ` +
          `We built ${plan.chosen.name} so that ${plan.domain.actionThing} is delivered instantly ` +
          `instead of guessed. With ${team.timeLabel.toLowerCase()} we deliberately kept the MVP to ` +
          `${plan.must[0].toLowerCase()} and ${plan.must[1].toLowerCase()}, and our next step is ` +
          `${plan.should[0].toLowerCase()}.`
      );
    });
  };

  const evaluate = () => {
    const ans = answer.trim();
    if (!ans) {
      setScore('Type your answer first, then press Score My Answer.');
      return;
    }
    if (busy) return;
    setBusy(true);
    setScore('Judging your answer…');
    askAIRetry(
      [{ role: 'user', content: `Judge question: "${question}"\n\nOur answer: "${ans}"` }],
      'judge-eval',
      context,
      (secs) => setScore(`AI is busy — retrying in ${secs}s…`)
    ).then((res) => {
      setBusy(false);
      if (res.ok && res.reply) {
        setScore(res.reply);
        return;
      }
      setAiLive(false);
      const words = ans.split(/\s+/).length;
      const n = Math.max(3, Math.min(9, Math.round(words / 12) + 3));
      setScore(
        `SCORE: ${n}/10  (offline mode)\n` +
          'GOOD: You answered directly and stayed on topic.\n' +
          'MISSING: Name your user and one measurable number — judges remember numbers.\n' +
          'BETTER ANSWER: ' +
          plan.samplePitch.split('. ').slice(0, 3).join('. ') +
          '.'
      );
    });
  };

  return (
    <section className="screen active">
      <div className="secbar">
        <button className="navbtn" onClick={() => onGo('dashboard')}>
          ← Back to Mentor Plan
        </button>
        <button className="navbtn" onClick={() => onGo('home')}>
          Home
        </button>
      </div>
      <div className="eyebrow">JUDGE MODE · PITCH PRESSURE TEST</div>
      <h2 style={{ fontSize: 26, marginBottom: 6 }}>Practice against a strict hackathon judge</h2>
      <p className="muted" style={{ margin: '0 0 18px' }}>
        One hard question at a time, based on your actual project.
      </p>

      <div className="qbox">
        <div className="eyebrow" style={{ color: 'var(--violet)' }}>
          JUDGE ASKS
        </div>
        <div className="q">{question}</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
          <button className="btn small" onClick={nextQuestion} disabled={busy}>
            Next Question →
          </button>
          <button className="btn ghost small" onClick={showSuggested} disabled={busy}>
            💡 Show Suggested Answer
          </button>
        </div>
        {suggested && (
          <div className="answerbox" style={{ display: 'block' }}>
            {suggested}
          </div>
        )}
      </div>

      <div className="card">
        <div className="eyebrow">PRACTISE YOUR OWN ANSWER</div>
        <textarea
          placeholder="Type the answer you would actually give the judge…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button className="btn small" style={{ marginTop: 12 }} onClick={evaluate} disabled={busy}>
          Score My Answer
        </button>
        {score && (
          <div className="answerbox" style={{ display: 'block' }}>
            {score}
          </div>
        )}
      </div>
    </section>
  );
}
