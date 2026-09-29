export default function TopBar({ aiLive, onGo, onReset }) {
  return (
    <div className="topbar">
      <div className="logo">
        <div className="mark">H</div>
        <div>
          HackMentor AI<small>MENTORING SYSTEM v2.0</small>
        </div>
      </div>
      <div className="spacer" />
      <div className="status">
        <span className={aiLive ? 'dot' : 'dot off'} />
        <span>{aiLive ? 'AI MENTOR ONLINE' : 'OFFLINE MENTOR MODE'}</span>
      </div>
      <button className="navbtn" onClick={() => onGo('home')}>
        Home
      </button>
      <button className="navbtn" onClick={onReset}>
        Reset Demo
      </button>
    </div>
  );
}
