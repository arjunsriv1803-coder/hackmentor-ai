import { LOCAL_JUDGE_Q } from './prompts.js';

export function offlineMentor(question, team, plan){
  var q = question.toLowerCase();
  var t = team, p = plan;
  var has = function(){ for (var i=0;i<arguments.length;i++) if (q.indexOf(arguments[i]) !== -1) return true; return false; };

  if (has('blockchain','kubernetes','microservice','docker','train a model','deep learning'))
    return 'No. With ' + t.timeLabel.toLowerCase() + ' left and a ' + t.experience.toLowerCase() +
      ' team, that would add complexity without improving your demo. Finish **' + p.chosen.name +
      '** first, and mention it only as future scope if it genuinely adds value.';

  if (has('remove','cut','drop','too much','30 minutes','less time','running out'))
    return 'Cut everything except these:\n- ' + p.must.join('\n- ') +
      '\n\nEverything on your SHOULD and NICE lists is now future scope. Say that confidently to the judges — ' +
      'deliberate scope control is a strength, not a weakness.';

  if (has('scope','too large','too big','realistic'))
    return 'Your scope risk is **' + p.risk + '**.\n\n' + p.scopeMsg;

  if (has('build first','start','begin','first','next step','what should we do'))
    return 'Start here, in this order:\n- ' + p.must.join('\n- ') +
      '\n\nDo not open anything else until that flow works from start to finish.';

  if (has('mvp','minimum','feature'))
    return '**MUST BUILD**\n- ' + p.must.join('\n- ') + '\n\n**SHOULD BUILD (only if time is left)**\n- ' + p.should.join('\n- ');

  if (has('idea','solution','options','alternatives'))
    return p.ideas.map(function(i,n){ return '**Idea ' + (n+1) + ': ' + i.name + '** — ' + i.desc +
      ' (' + i.impact + ' impact, ' + i.difficulty + ' difficulty)'; }).join('\n\n') +
      '\n\nMy recommendation for your team: **' + p.chosen.name + '**.';

  if (has('technology','tech stack','language','framework','tools','which stack'))
    return 'Use:\n- ' + p.tech.join('\n- ') + '\n\n' + p.techWhy;

  if (has('user','persona','customer','who is','stakeholder','audience'))
    return 'Primary user: **' + p.domain.primary + '** — ' + p.domain.primaryWhy + '.\n' +
      'Secondary user: **' + p.domain.secondary + '** — ' + p.domain.secondaryWhy + '.\n' +
      'Stakeholders: ' + p.domain.stakeholders + '.';

  if (has('problem','understand','meaning','what does'))
    return 'In simple words, ' + p.domain.plain + '.\n\nYour design-thinking question is:\n**How might we ' +
      p.domain.hmw + '?**';

  if (has('time','schedule','plan','timeline','manage'))
    return 'Timeline for your ' + t.timeLabel.toLowerCase() + ':\n- ' +
      p.timeline.map(function(x){ return x.range + ': ' + x.task; }).join('\n- ');

  if (has('valid','test','prove','evidence','metric'))
    return p.validation.map(function(v){ return '**' + v.what + '**\nHow: ' + v.how + '\nSuccess: ' + v.metric; }).join('\n\n');

  if (has('demo','present','show','presentation'))
    return 'Demo in 7 steps:\n- ' + p.demoPlan.join('\n- ');

  if (has('pitch','jury','story','script'))
    return '**Sample pitch:**\n' + p.samplePitch;

  if (has('judge','challenge','hard question','criticis','tough'))
    return 'Judge question for you: **' + LOCAL_JUDGE_Q[Math.floor(Math.random()*LOCAL_JUDGE_Q.length)] +
      '**\n\nOpen Judge Mode to practise a full round.';

  if (has('risk','wrong','fail','assumption'))
    return 'Your top risks:\n- ' + p.risks.join('\n- ') + '\n\nBiggest assumption: ' + p.assumptions[0];

  /* default */
  return 'Offline mentor mode. Based on your problem and your ' + t.timeLabel.toLowerCase() + ' remaining, ' +
    'the highest-value thing you can do right now is finish **' + p.chosen.name + '**:\n- ' + p.must.join('\n- ') +
    '\n\nTry asking me about: scope, MVP, technology, users, demo, pitch or judge questions.';
}
