import { getKnowledgeArticle } from "../lib/data.js";
import { escapeHtml } from "../lib/status.js";
import { renderMarkdown } from "../lib/markdown.js";

export async function renderKnowledgeArticle(container, { slug }) {
  const article = await getKnowledgeArticle(slug);
  container.innerHTML = `
    <div class="screen-pad">
      <a href="#/knowledge" class="btn btn-secondary" style="margin-bottom:12px;display:inline-block;">&larr; Knowledge base</a>
      <h2>${escapeHtml(article.meta.title ?? slug)}</h2>
      <p style="color:var(--text-dim);font-size:0.8rem;">Confidence: ${escapeHtml(article.meta.confidence ?? "?")} &middot; last verified ${escapeHtml(article.meta.lastVerified ?? "?")}</p>
      <div class="card">${renderMarkdown(article.body)}</div>
    </div>
  `;
}
