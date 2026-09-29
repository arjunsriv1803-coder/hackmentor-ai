/* Renders the light markdown the AI sends back: **bold** and "- " bullet lists.
   Built as real elements rather than raw HTML, so nothing user supplied can
   ever be injected into the page. */

function bold(text, keyPrefix) {
  const parts = String(text).split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={keyPrefix + i}>{part}</strong> : part
  );
}

export default function Markdown({ text }) {
  const lines = String(text).split('\n');
  const out = [];
  let bullets = [];

  const flush = (key) => {
    if (!bullets.length) return;
    out.push(
      <ul key={'ul' + key}>
        {bullets.map((b, i) => (
          <li key={i}>{bold(b, 'b' + key + i)}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  lines.forEach((line, i) => {
    if (/^\s*[-*•]\s+/.test(line)) {
      bullets.push(line.replace(/^\s*[-*•]\s+/, ''));
      return;
    }
    flush(i);
    if (line.trim()) out.push(<div key={i}>{bold(line, 'l' + i)}</div>);
    else out.push(<div key={i} style={{ height: 6 }} />);
  });
  flush('end');

  return <>{out}</>;
}
