/* Static reference data for the organising committee dashboard. */

export const MENTOR_POOL = [
  { name: 'Unassigned', skill: '—' },
  { name: 'Dr. R. Nair', skill: 'AI / Data' },
  { name: 'Ms. K. Sharma', skill: 'Product & UX' },
  { name: 'Mr. A. Verma', skill: 'Web & Backend' },
  { name: 'Ms. P. Iyer', skill: 'Business & Pitch' },
  { name: 'Mr. S. Khan', skill: 'Hardware / IoT' }
];

export const PROBLEM_BANK = [
  { code: 'PS-01', title: 'Reduce food wastage in college canteens' },
  { code: 'PS-02', title: 'Help students who are falling behind in class' },
  { code: 'PS-03', title: 'Citizen complaints are ignored by local bodies' },
  { code: 'PS-04', title: 'Commuters cannot predict bus or train delays' },
  { code: 'PS-05', title: 'Farmers lack timely local crop advice' },
  { code: 'PS-06', title: 'Campus safety response is too slow' }
];

export const SAMPLE_TEAMS = [
  { id:'s1', name:'Team Phoenix', domain:'Food & Waste', experience:'Beginner', size:4,
    timeLabel:'3 Hours', risk:'HIGH', progress:65, problem:'Reduce food wastage in college canteens',
    chosen:'Food Tracker Dashboard', issue:'Scope too large', ps:'PS-01', sample:true },
  { id:'s2', name:'Team Nova', domain:'Education & Learning', experience:'Intermediate', size:4,
    timeLabel:'6 Hours', risk:'LOW', progress:80, problem:'Students falling behind in class',
    chosen:'Smart Education Assistant', issue:'Demo preparation', ps:'PS-02', sample:true },
  { id:'s3', name:'Team Atlas', domain:'Civic Complaints & Governance', experience:'Beginner', size:3,
    timeLabel:'3 Hours', risk:'HIGH', progress:40, problem:'Citizen complaints are ignored',
    chosen:'Civic Tracker Dashboard', issue:'Technical blockage', ps:'PS-03', sample:true },
  { id:'s4', name:'Team Vertex', domain:'Transport & Mobility', experience:'Advanced', size:4,
    timeLabel:'12 Hours', risk:'MEDIUM', progress:72, problem:'Commuters cannot predict delays',
    chosen:'AI Transport Copilot', issue:'Unclear impact metric', ps:'PS-04', sample:true },
  { id:'s5', name:'Team Orbit', domain:'Agriculture', experience:'Intermediate', size:5,
    timeLabel:'6 Hours', risk:'MEDIUM', progress:55, problem:'Farmers lack timely crop advice',
    chosen:'Smart Agri Assistant', issue:'Problem misunderstood', ps:'PS-05', sample:true }
];

export const DEFAULT_LOGISTICS = [
  { task: 'Venue and seating ready for all teams', done: true },
  { task: 'Wi-Fi credentials shared with every team', done: true },
  { task: 'Problem statements distributed', done: false },
  { task: 'Mentors assigned to all groups', done: false },
  { task: 'Lunch and refreshments scheduled', done: false },
  { task: 'Judging rubric shared with jury', done: false },
  { task: 'Projector / demo stage tested', done: false },
  { task: 'Final submission deadline announced', done: false }
];
