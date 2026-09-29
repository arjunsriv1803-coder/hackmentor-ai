/* The mentor plan engine. Pure logic - no React, no DOM.
   Given a team, it produces every section of the mentor plan. */

export const DOMAINS = [
  { key:'food', label:'Food & Waste', words:['food','canteen','meal','mess','restaurant','kitchen','hunger','nutrition','wastage','waste'],
    plain:'too much food is being prepared, served or thrown away because nobody can predict actual demand accurately',
    primary:'Canteen / Kitchen Manager', primaryWhy:'they decide how much food is cooked every day',
    secondary:'Student / Daily Customer', secondaryWhy:'they decide what and when they will eat',
    stakeholders:'College administration, food suppliers, NGOs collecting surplus, sustainability committee',
    hmw:'help canteens estimate daily meal demand more accurately so they reduce wastage without running out of food',
    dataThing:'daily meal demand', actionThing:'how much of each dish to prepare' },

  { key:'education', label:'Education & Learning', words:['education','student','learn','school','college','teacher','exam','study','course','dropout','skill'],
    plain:'learners are struggling but teachers cannot see who is falling behind or why, until it is too late',
    primary:'Student', primaryWhy:'they experience the learning gap directly',
    secondary:'Teacher / Faculty', secondaryWhy:'they need to know who needs help and when',
    stakeholders:'Parents, school administration, education boards, ed-tech partners',
    hmw:'help teachers spot struggling learners early and give them the right support at the right time',
    dataThing:'learning progress', actionThing:'which topic to revise next' },

  { key:'health', label:'Healthcare', words:['health','patient','hospital','doctor','medic','clinic','disease','mental','ambulance','medicine'],
    plain:'people are not getting timely care because information, appointments and follow-ups are scattered and slow',
    primary:'Patient', primaryWhy:'they need care quickly and clearly',
    secondary:'Doctor / Health Worker', secondaryWhy:'they need reliable patient information fast',
    stakeholders:'Hospital administration, pharmacies, insurance providers, public health departments',
    hmw:'help patients reach the right care faster while giving health workers clearer information',
    dataThing:'patient symptoms and history', actionThing:'the right next step for the patient' },

  { key:'transport', label:'Transport & Mobility', words:['transport','traffic','bus','railway','train','vehicle','commute','parking','road','travel','metro'],
    plain:'travel time and crowding are unpredictable because live information never reaches the traveller in a usable form',
    primary:'Daily Commuter', primaryWhy:'they lose time and money to unpredictable travel',
    secondary:'Transport Operator / Driver', secondaryWhy:'they manage routes, load and schedules',
    stakeholders:'City transport authority, traffic police, municipal corporation, passengers with accessibility needs',
    hmw:'give commuters reliable live guidance so they avoid delays and crowding',
    dataThing:'route and crowding information', actionThing:'the best route and departure time' },

  { key:'complaints', label:'Civic Complaints & Governance', words:['complaint','grievance','citizen','municipal','governance','public service','ticket','helpline','corruption'],
    plain:'complaints are raised but they get lost, mis-routed or ignored, so citizens lose trust and issues stay unfixed',
    primary:'Citizen Raising the Complaint', primaryWhy:'they need their issue actually resolved and tracked',
    secondary:'Department Officer', secondaryWhy:'they must prioritise a large queue of complaints',
    stakeholders:'Municipal corporation, field workers, elected representatives, auditors',
    hmw:'make sure every citizen complaint reaches the right department quickly and is visibly tracked to resolution',
    dataThing:'incoming complaints', actionThing:'which department should act and how urgently' },

  { key:'environment', label:'Environment & Sustainability', words:['environment','pollution','climate','carbon','recycle','plastic','green','energy','solar','water','tree'],
    plain:'harmful behaviour continues because the impact is invisible and nobody sees the cost of their daily choices',
    primary:'Local Resident / Consumer', primaryWhy:'their daily choices create the impact',
    secondary:'Facility or Community Manager', secondaryWhy:'they can change the system, not just the behaviour',
    stakeholders:'Municipal bodies, environmental NGOs, recycling vendors, regulators',
    hmw:'make environmental impact visible and easy to act on in everyday decisions',
    dataThing:'consumption and waste data', actionThing:'the one change with the biggest impact' },

  { key:'agri', label:'Agriculture', words:['agri','farm','crop','soil','irrigation','harvest','farmer','pesticide','yield','mandi'],
    plain:'farmers make high-risk decisions using guesswork because reliable, local, timely advice does not reach them',
    primary:'Small Farmer', primaryWhy:'they carry the financial risk of every decision',
    secondary:'Local Agri Officer / Trader', secondaryWhy:'they advise farmers and connect them to markets',
    stakeholders:'Cooperatives, buyers and mandis, agri-input suppliers, state agriculture department',
    hmw:'give farmers simple, local and timely guidance so they lose less crop and earn more',
    dataThing:'crop, soil and weather details', actionThing:'what to do this week on the field' },

  { key:'finance', label:'Finance & Fintech', words:['finance','money','bank','loan','payment','budget','saving','credit','insurance','expense','fraud'],
    plain:'people make poor money decisions because their financial situation is never shown to them in a clear, simple way',
    primary:'Individual User / Small Business Owner', primaryWhy:'they manage the money day to day',
    secondary:'Financial Advisor / Lender', secondaryWhy:'they assess risk and offer products',
    stakeholders:'Banks, regulators, family members, small business networks',
    hmw:'help people understand their real financial position and take one better decision at a time',
    dataThing:'income, spending and repayment data', actionThing:'the safest next financial step' },

  { key:'safety', label:'Safety & Security', words:['safety','security','crime','emergency','disaster','women safety','accident','fire','rescue','sos'],
    plain:'in a risky moment people cannot get help fast enough because alerting, locating and responding are disconnected',
    primary:'Person at Risk', primaryWhy:'they need help within seconds, not minutes',
    secondary:'Responder / Guardian', secondaryWhy:'they act on the alert',
    stakeholders:'Police and emergency services, campus or facility security, family members, local authorities',
    hmw:'cut the time between someone needing help and the right person actually responding',
    dataThing:'alerts and location data', actionThing:'who to notify and how fast' },

  { key:'jobs', label:'Jobs & Employment', words:['job','employment','career','resume','recruit','hiring','intern','placement','unemploy'],
    plain:'capable people and real opportunities never find each other because matching is manual, slow and biased',
    primary:'Job Seeker', primaryWhy:'they need relevant opportunities and honest feedback',
    secondary:'Recruiter / Employer', secondaryWhy:'they need to shortlist quickly and fairly',
    stakeholders:'Training institutes, placement cells, employers, skill councils',
    hmw:'match people to opportunities they can realistically get, and show them what to improve',
    dataThing:'skills and job requirements', actionThing:'the best-fit opportunity and the skill gap to close' }
];

export const GENERIC = {
  key:'generic', label:'General Problem',
  plain:'a group of people repeatedly lose time, money or trust because the current process is manual, unclear or disconnected',
  primary:'The person who feels the pain daily', primaryWhy:'they suffer the problem directly and will use your solution first',
  secondary:'The person who manages or fixes the process', secondaryWhy:'they control the system that creates the problem',
  stakeholders:'The organisation that funds it, partners or vendors, and any regulator or authority involved',
  hmw:'make this process faster, clearer and more reliable for the people who deal with it every day',
  dataThing:'the key information people are missing', actionThing:'the next best action to take'
};

export function detectDomain(text){
  var t = (text || '').toLowerCase();
  var best = null, bestScore = 0;
  DOMAINS.forEach(function(d){
    var score = 0;
    d.words.forEach(function(w){ if (t.indexOf(w) !== -1) score++; });
    if (score > bestScore) { bestScore = score; best = d; }
  });
  return best || GENERIC;
}

export function fmtMin(m){ return m < 120 ? Math.round(m) + ' min' : (Math.round(m/6)/10) + ' h'; }
export function timeLabel(m){
  return m===60?'1 Hour':m===180?'3 Hours':m===360?'6 Hours':m===720?'12 Hours':m===1440?'24 Hours':'48 Hours';
}

export function buildPlan(team){
  var d = detectDomain(team.problem);
  var mins = team.minutes;
  var beginner = team.experience === 'Beginner';
  var advanced = team.experience === 'Advanced';
  var noTech = team.skills.indexOf('No Technical Skills') !== -1 || team.skills.length === 0;
  var short = mins <= 180;

  /* --- SECTION 4: three solution ideas --- */
  var ideas = [
    { name: d.label.split(' ')[0] + ' Tracker Dashboard',
      desc: 'A simple web page where the ' + d.primary.toLowerCase() + ' records ' + d.dataThing +
            ', plus a clean dashboard that shows the trend and highlights the problem areas.',
      impact:'Medium', difficulty:'Low', feasibility:'High', complexity:'Small (1 screen + 1 dashboard)' },
    { name: 'Smart ' + d.label.split(' ')[0] + ' Assistant',
      desc: 'The user enters a few details about ' + d.dataThing + ' and the app instantly recommends ' +
            d.actionThing + ' using simple built-in rules, with a clear before/after result.',
      impact:'High', difficulty:'Medium', feasibility:'High', complexity:'Medium (form + logic + result screen)' },
    { name: 'AI ' + d.label.split(' ')[0] + ' Copilot',
      desc: 'An AI chat assistant that reads ' + d.dataThing + ', predicts upcoming problems and explains ' +
            d.actionThing + ' in plain language for non-technical users.',
      impact:'High', difficulty:'High', feasibility:'Medium', complexity:'Large (AI API + data + chat UI)' }
  ];

  /* --- SECTION 5: pick the right one for THIS team --- */
  var pickIndex, why;
  if (noTech || (beginner && mins <= 60)) {
    pickIndex = 0;
    why = 'Because ' + team.name + ' is a ' + team.experience.toLowerCase() + ' team with ' +
          timeLabel(mins).toLowerCase() + ' left and limited coding depth, Idea 1 is the safest choice. ' +
          'It gives judges something visible and working on screen without needing complex logic or infrastructure. ' +
          'You can still describe Idea 3 as your future scope.';
  } else if (advanced && mins >= 720) {
    pickIndex = 2;
    why = 'Because ' + team.name + ' is an advanced team with ' + timeLabel(mins).toLowerCase() +
          ' remaining and skills in ' + team.skills.slice(0,3).join(', ') + ', you can realistically finish Idea 3. ' +
          'It has the strongest impact story and it clearly justifies why AI is needed.';
  } else {
    pickIndex = 1;
    why = 'Because ' + team.name + ' has ' + timeLabel(mins).toLowerCase() + ' left, ' + team.size +
          ' members and ' + team.experience.toLowerCase() + ' experience, Idea 2 is the best balance. ' +
          'It produces a real interaction judges can watch end-to-end (input → recommendation → result) ' +
          'without the risk of an unfinished AI pipeline.';
  }
  var chosen = ideas[pickIndex];

  /* --- SECTION 6: MVP split --- */
  var must, should, nice;
  if (short) {
    must = [
      'One input screen where the ' + d.primary.toLowerCase() + ' enters ' + d.dataThing,
      'One result screen that clearly shows ' + d.actionThing,
      'Two or three pieces of built-in sample data so the demo always works'
    ];
    should = [
      'A simple summary or chart of the result',
      'A "Load demo example" button for instant demoing',
      'Basic error message if the form is empty'
    ];
    nice = [
      'Login and user accounts', 'Real database storage', 'Mobile app version',
      'Notifications, reports and analytics'
    ];
  } else {
    must = [
      'Input flow for the ' + d.primary.toLowerCase(),
      'Core logic that produces ' + d.actionThing,
      'Result / dashboard screen with a clear before-and-after',
      'Sample data set so the demo never depends on live input'
    ];
    should = [
      'A second view for the ' + d.secondary.toLowerCase(),
      'Simple charts or a visual summary',
      'Saving results locally so the demo keeps its state',
      'An AI explanation of the result in plain language'
    ];
    nice = [
      'Accounts and roles', 'Real production database', 'Mobile application',
      'Notifications and long-term analytics'
    ];
  }

  /* --- SECTION 7: scope guardian --- */
  var riskScore = 0, flags = [];
  if (mins <= 60) riskScore += 3; else if (mins <= 180) riskScore += 2; else if (mins <= 360) riskScore += 1;
  if (beginner) riskScore += 2; else if (team.experience === 'Intermediate') riskScore += 1;
  if (team.size <= 2) riskScore += 1;
  if (noTech) riskScore += 1;

  var heavy = [
    ['blockchain','Blockchain'], ['machine learning','Machine learning model'], ['ml model','ML model'],
    ['train','Model training'], ['iot','IoT hardware'], ['sensor','Physical sensors'],
    ['mobile app','Mobile app'], ['android','Android app'], ['real-time','Real-time infrastructure'],
    ['microservice','Microservices'], ['kubernetes','Kubernetes'], ['docker','Docker'],
    ['authentication','User authentication'], ['login','Login system'], ['database','Full database']
  ];
  var lower = (team.problem || '').toLowerCase();
  heavy.forEach(function(h){ if (lower.indexOf(h[0]) !== -1 && flags.indexOf(h[1]) === -1) flags.push(h[1]); });
  if (flags.length) riskScore += 2;

  var risk = riskScore >= 5 ? 'HIGH' : riskScore >= 3 ? 'MEDIUM' : 'LOW';
  var scopeMsg;
  if (risk === 'HIGH') {
    scopeMsg = 'You have ' + timeLabel(mins).toLowerCase() + ' and a ' + team.experience.toLowerCase() +
      ' team. Build the single core user flow first and do not touch anything else until it works end-to-end. ' +
      'A small finished demo beats a large broken one every single time.';
  } else if (risk === 'MEDIUM') {
    scopeMsg = 'Your scope is manageable but it can slip. Finish the MUST BUILD list completely before you ' +
      'start anything from SHOULD BUILD, and freeze all new features when ' + fmtMin(Math.round(mins*0.6)) + ' have passed.';
  } else {
    scopeMsg = 'Your scope looks realistic for your time and skills. Protect it — do not add new features late. ' +
      'Use the extra time for testing and demo practice instead.';
  }
  var avoid = ['Blockchain','Model training','Microservices','Kubernetes / Docker','Login & authentication',
               'Heavy databases','IoT hardware','Native mobile app','Multiple external APIs','Advanced analytics'];

  /* --- SECTION 8: technology --- */
  var tech, techWhy;
  if (short || beginner || noTech) {
    tech = ['HTML','CSS','JavaScript (vanilla)','Sample data stored inside the code','One simple LLM API call (only if already configured)'];
    techWhy = 'With ' + timeLabel(mins).toLowerCase() + ' remaining, anything that needs installation, configuration or ' +
      'deployment is a risk. Plain HTML/CSS/JS runs instantly on any laptop and cannot break during your demo.';
  } else if (advanced && mins >= 720) {
    tech = ['HTML/CSS/JS or React','A small Node.js or Python backend','An LLM API for the intelligent part',
            'JSON or SQLite for storage','One free hosting service if you have spare time'];
    techWhy = 'Your team has the skills and the time, so a small backend is affordable. Still keep it to one service — ' +
      'do not split into microservices and do not deploy complex infrastructure.';
  } else {
    tech = ['HTML/CSS/JavaScript','A tiny backend only if you need to hide an API key','JSON sample data','One LLM API call for the smart feature'];
    techWhy = 'This gives you a real, intelligent feature without any installation risk. Add a backend only for the ' +
      'one thing that genuinely needs it: keeping your API key secret.';
  }
  if (team.skills.indexOf('Python') !== -1 && !short) tech.push('Python (Flask) is fine since your team already knows it');

  /* --- SECTION 9: build plan (scaled to the real time left) --- */
  var phases = [
    [0.000,0.167,'Build the interface'],
    [0.167,0.417,'Build the core functionality'],
    [0.417,0.583,'Test everything'],
    [0.583,0.667,'Polish the UI'],
    [0.667,0.833,'Prepare the demo'],
    [0.833,1.000,'Practise the pitch']
  ];
  var timeline = phases.map(function(p){
    return { range: fmtMin(mins*p[0]) + ' – ' + fmtMin(mins*p[1]), task: p[2] };
  });

  /* --- SECTIONS 10-14 --- */
  var assumptions = [
    'The ' + d.primary.toLowerCase() + ' is willing to spend a few seconds entering ' + d.dataThing + '.',
    'The information we need already exists somewhere and can be collected reliably.',
    'A simple recommendation is enough to change behaviour — a perfect prediction is not required.'
  ];
  var risks = [
    risk === 'HIGH' ? 'Scope risk: the team runs out of time before the core flow works.'
                    : 'Time risk: late feature additions break a working demo.',
    'Data risk: real data may not be available, so the demo must include built-in sample data.',
    'Adoption risk: the ' + d.primary.toLowerCase() + ' may not change their existing habit without a clear benefit.'
  ];
  var validation = [
    { what:'Does anyone actually have this problem?', how:'Ask 5 real ' + d.primary.toLowerCase() + 's one question about ' + d.dataThing + '.', metric:'At least 3 out of 5 describe the same pain.' },
    { what:'Can a new user finish the main flow?', how:'Hand your laptop to someone from another team and say nothing.', metric:'They complete it in under 60 seconds without help.' },
    { what:'Does the output feel useful?', how:'Show the recommendation to 3 people and ask "would you act on this?"', metric:'Two of three say yes and can explain why.' }
  ];
  var demoPlan = [
    'Say the problem in one sentence: "' + (team.problem || '').slice(0,110) + (String(team.problem||'').length>110?'…':'') + '"',
    'Introduce the real user: the ' + d.primary.toLowerCase() + ', and why they suffer today.',
    'Show the main interaction live — enter ' + d.dataThing + ' on screen.',
    'Show the result: ' + d.actionThing + ', clearly on screen.',
    'Explain the value in one line: what it saves in time, money or risk.',
    'Show the impact number or the before/after comparison.',
    'End with one future-scope line, then stop talking.'
  ];
  var pitch = [
    'Problem — ' + (team.problem || '').slice(0,120),
    'User — ' + d.primary,
    'Pain today — ' + d.plain,
    'Solution — ' + chosen.name + ': ' + chosen.desc,
    'Why AI helps — it turns messy, scattered information into one clear recommendation instantly, and explains it in plain language',
    'MVP — ' + must.slice(0,2).join(' + '),
    'Innovation — it is context-aware: it adapts to the real situation instead of giving generic advice',
    'Impact — fewer wasted resources, faster decisions and a measurable reduction in the core problem',
    'Future scope — ' + ideas[2].name + ', real data integration and multi-organisation rollout'
  ];
  var samplePitch =
    'Today, ' + d.plain + '. Our user is the ' + d.primary.toLowerCase() + ', who ' + d.primaryWhy + '. ' +
    'We built ' + chosen.name + ' — ' + chosen.desc.charAt(0).toLowerCase() + chosen.desc.slice(1) + ' ' +
    'In our demo you will see a real ' + d.dataThing + ' go in and ' + d.actionThing + ' come out in seconds. ' +
    'It matters because every wrong decision here costs time, money and trust. ' +
    'Next, we would connect real data and expand this across more organisations.';

  return { domain:d, ideas:ideas, chosenIndex:pickIndex, chosen:chosen, why:why,
           must:must, should:should, nice:nice, risk:risk, scopeMsg:scopeMsg, flags:flags, avoid:avoid,
           tech:tech, techWhy:techWhy, timeline:timeline, assumptions:assumptions, risks:risks,
           validation:validation, demoPlan:demoPlan, pitch:pitch, samplePitch:samplePitch };
}
