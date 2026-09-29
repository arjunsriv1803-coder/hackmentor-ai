/* Organising committee logic: the team registry, how teams are split into
   groups, mentor assignment, logistics and the message feed. */

import { lsGet, lsSet } from './storage.js';
import { SAMPLE_TEAMS, PROBLEM_BANK, MENTOR_POOL, DEFAULT_LOGISTICS } from './orgData.js';

/* Save the team that just filled in the intake form, so organisers see real data. */
export function saveTeamToRegistry(team, plan) {
  const teams = lsGet('hm_teams', []);
  const record = {
    id: 't' + Date.now(),
    name: team.name,
    domain: plan.domain.label,
    experience: team.experience,
    size: team.size,
    timeLabel: team.timeLabel,
    risk: plan.risk,
    progress: plan.risk === 'LOW' ? 70 : plan.risk === 'MEDIUM' ? 50 : 30,
    problem: team.problem,
    chosen: plan.chosen.name,
    issue: plan.risk === 'HIGH' ? 'Scope too large' : 'On track',
    ps:
      (PROBLEM_BANK.filter(
        (x) => team.problem.toLowerCase().indexOf(x.title.toLowerCase().split(' ')[0]) !== -1
      )[0] || {}).code || '',
    sample: false
  };
  // one entry per team name - update instead of duplicating
  const found = teams.findIndex((t) => t.name === record.name);
  if (found !== -1) {
    record.id = teams[found].id;
    teams[found] = record;
  } else {
    teams.push(record);
  }
  lsSet('hm_teams', teams);
}

export function allTeams() {
  return SAMPLE_TEAMS.concat(lsGet('hm_teams', []));
}

/* Teams are grouped by the problem domain they are working on. */
export function buildGroups() {
  const teams = allTeams();
  const map = {};
  const order = [];
  teams.forEach((t) => {
    const key = t.domain || 'General';
    if (!map[key]) {
      map[key] = [];
      order.push(key);
    }
    map[key].push(t);
  });
  const assigned = lsGet('hm_mentors', {});
  return order.map((key, i) => ({
    id: 'G' + (i + 1),
    track: key,
    teams: map[key],
    mentor: assigned[key] || 'Unassigned'
  }));
}

export function setMentor(track, name) {
  const a = lsGet('hm_mentors', {});
  a[track] = name;
  lsSet('hm_mentors', a);
}

export function autoAssign() {
  const groups = buildGroups();
  const a = lsGet('hm_mentors', {});
  groups.forEach((g, i) => {
    a[g.track] = MENTOR_POOL[(i % (MENTOR_POOL.length - 1)) + 1].name;
  });
  lsSet('hm_mentors', a);
}

export function getLogistics() {
  return lsGet('hm_logi', DEFAULT_LOGISTICS);
}

export function toggleLogi(i) {
  const l = getLogistics();
  l[i].done = !l[i].done;
  lsSet('hm_logi', l);
}

export function setProblem(teamId, code) {
  const overrides = lsGet('hm_ps', {});
  overrides[teamId] = code;
  lsSet('hm_ps', overrides);
}

export function teamProblemCode(t) {
  const o = lsGet('hm_ps', {});
  return o[t.id] || t.ps || '';
}

export function getFeed() {
  return lsGet('hm_feed', []);
}

export function postMessage(from, text, kind) {
  const feed = getFeed();
  feed.unshift({ from, text, kind, time: new Date().toLocaleTimeString() });
  lsSet('hm_feed', feed.slice(0, 40));
}

export function latestAnnouncement() {
  return getFeed().filter((m) => m.kind === 'org')[0] || null;
}
