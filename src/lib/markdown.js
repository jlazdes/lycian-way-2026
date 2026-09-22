// Tiny markdown-subset renderer: headers, bold, links, tables, lists, paragraphs.
// Only supports what the knowledge base articles actually use — not a general parser.

export function renderMarkdown(md) {
  const lines = md.split("\n");
  let html = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    if (line.startsWith("# ")) { html += `<h2>${inline(line.slice(2))}</h2>`; i++; continue; }
    if (line.startsWith("## ")) { html += `<h3>${inline(line.slice(3))}</h3>`; i++; continue; }
    if (line.startsWith("**") && line.match(/^\*\*.+\*\*/)) { /* fallthrough to paragraph */ }
    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) { tableLines.push(lines[i]); i++; }
      html += renderTable(tableLines);
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++; }
      html += `<ul>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ul>`;
      continue;
    }
    // paragraph: collect until blank line
    const para = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !lines[i].startsWith("|") && !lines[i].startsWith("- ") && !lines[i].startsWith("#")) {
      para.push(lines[i]); i++;
    }
    html += `<p>${inline(para.join(" "))}</p>`;
  }
  return html;
}

function renderTable(tableLines) {
  const rows = tableLines.filter((l) => !/^\|[\s-]+\|$/.test(l.replace(/[^|\s-]/g, "") ? l : l));
  const dataRows = tableLines.filter((l) => !/^\|(\s*-+\s*\|)+$/.test(l));
  const cells = dataRows.map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
  if (!cells.length) return "";
  const [header, ...body] = cells;
  return `<table class="phrases">
    <tbody>
      ${body.map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`;
}

function inline(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, label, href) => {
      const isMd = href.endsWith(".md");
      const cleanHref = isMd ? `#/knowledge/${href.replace(/\.md$/, "")}` : href;
      return `<a href="${cleanHref}"${isMd ? "" : ' target="_blank" rel="noopener"'}>${label}</a>`;
    });
}
