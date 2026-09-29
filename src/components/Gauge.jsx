/* Readiness ring in the chat sidebar, derived from the Scope Guardian risk level. */

const CIRCUMFERENCE = 2 * Math.PI * 52;

export default function Gauge({ risk, timeLabel }) {
  const score = risk === 'LOW' ? 86 : risk === 'MEDIUM' ? 64 : 41;
  const riskClass = risk === 'HIGH' ? 'bad' : risk === 'MEDIUM' ? 'warn' : 'good';

  return (
    <div className="gaugerow">
      <div className="gaugewrap">
        <svg className="gauge" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFB454" />
              <stop offset="100%" stopColor="#9C8CFF" />
            </linearGradient>
          </defs>
          <circle className="track" cx="60" cy="60" r="52" />
          <circle
            className="arc"
            cx="60"
            cy="60"
            r="52"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
          />
        </svg>
        <div className="gaugecenter">
          <b>{score}</b>
          <i>READINESS</i>
        </div>
      </div>
      <div className="gstats">
        <div className="gstat">
          <div className="gk">TIME REMAINING</div>
          <div className="gval">{timeLabel.toUpperCase()}</div>
        </div>
        <div className="gstat">
          <div className="gk">SCOPE RISK</div>
          <div className={'gval ' + riskClass}>{risk}</div>
        </div>
      </div>
    </div>
  );
}
