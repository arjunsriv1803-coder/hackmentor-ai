/* Talking to our own small backend, which holds the secret API key. */

export function buildContext(team, plan) {
  if (!team) return {};
  return {
    teamName: team.name,
    teamSize: team.size,
    experience: team.experience,
    skills: team.skills,
    timeLabel: team.timeLabel,
    problem: team.problem,
    recommended: plan ? `${plan.chosen.name} — ${plan.chosen.desc}` : '',
    mvp: plan ? plan.must : [],
    tech: plan ? plan.tech : [],
    risks: plan ? plan.risks : []
  };
}

export function askAI(messages, mode, context) {
  return fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, context, mode })
  })
    .then((r) => r.json())
    .catch(() => ({ ok: false, error: 'network' }));
}

/* Google's free tier allows only a few requests per minute. If we hit that,
   wait the time Google asks for and try once more instead of giving up. */
export function askAIRetry(messages, mode, context, onBusy) {
  return askAI(messages, mode, context).then((res) => {
    if (res.ok) return res;
    if (res.kind === 'busy' && res.retryAfter && res.retryAfter <= 30) {
      const wait = res.retryAfter + 1;
      if (onBusy) onBusy(wait);
      return new Promise((done) => {
        setTimeout(() => done(askAI(messages, mode, context)), wait * 1000);
      });
    }
    return res;
  });
}

export function checkHealth() {
  return fetch('/api/health')
    .then((r) => r.json())
    .catch(() => ({ live: false }));
}
