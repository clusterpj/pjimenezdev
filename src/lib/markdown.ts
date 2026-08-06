/**
 * ponytail: a ~20-line markdown subset instead of MDX or `marked`. The only
 * author is the drafting prompt in `growth.ts`, and every fragment is
 * HTML-escaped before a tag is inserted — the output goes through
 * dangerouslySetInnerHTML, so that ordering is the whole safety argument.
 * Swap in a real parser the day notes take outside content.
 */
export function md(src: string): string {
  // Quotes are escaped too, not just angle brackets: the href capture below
  // lands inside an attribute, and `[x](/a"onmouseover=alert(1))` has no
  // whitespace to stop the URL pattern — it would close the attribute early.
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const inline = (s: string) =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code style="font:400 .9em var(--font-mono),monospace;color:var(--accent);background:var(--accent-subtle);padding:2px 5px;border-radius:4px">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--text-display);font-weight:600">$1</strong>')
      // href is restricted to http(s) or root-relative on purpose: anything
      // else (javascript:, data:) simply isn't a link and stays as literal text.
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
        '<a href="$2" style="color:var(--accent);text-decoration:none;border-bottom:1px solid var(--border-accent)">$1</a>');

  return src
    .split(/\n{2,}/)
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (b.startsWith("### ")) return `<h3 style="font:600 20px/1.3 var(--font-display),sans-serif;color:var(--text-display);margin:32px 0 12px">${inline(b.slice(4))}</h3>`;
      if (b.startsWith("## ")) return `<h2 style="font:600 26px/1.25 var(--font-display),sans-serif;color:var(--text-display);margin:44px 0 14px">${inline(b.slice(3))}</h2>`;
      if (/^[-*] /.test(b))
        return `<ul style="margin:0 0 20px;padding-left:20px">${b.split("\n").map((l) => `<li style="margin-bottom:8px">${inline(l.replace(/^[-*] /, ""))}</li>`).join("")}</ul>`;
      return `<p style="margin:0 0 20px">${inline(b)}</p>`;
    })
    .join("");
}
