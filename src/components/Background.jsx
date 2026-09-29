/* The ambient background: vignette, grid, three drifting orbs and film grain.
   Purely decorative. */
export default function Background() {
  return (
    <div id="bgLayer" aria-hidden="true">
      <div className="vignette" />
      <div className="grid" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />
      <div className="grain" />
    </div>
  );
}
