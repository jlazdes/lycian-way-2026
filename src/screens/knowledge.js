import { listKnowledgeArticles, getKnowledgeArticle } from "../lib/data.js";
import { escapeHtml } from "../lib/status.js";
import { renderMarkdown } from "../lib/markdown.js";

export async function renderKnowledgeList(container) {
  const slugs = await listKnowledgeArticles();
  const articles = await Promise.all(slugs.map((s) => getKnowledgeArticle(s).then((a) => [s, a])));
  container.innerHTML = `
    <div class="screen-pad">
      <div class="section-title">Knowledge base</div>
      ${articles.map(([slug, a]) => `
        <a href="#/knowledge/${slug}" class="card" style="display:block;text-decoration:none;color:inherit;">
          <h3>${escapeHtml(a.meta.title ?? slug)}</h3>
          <p>Confidence: ${escapeHtml(a.meta.confidence ?? "?")} &middot; last verified ${escapeHtml(a.meta.lastVerified ?? "?")}</p>
        </a>
      `).join("")}
    </div>
  `;
}

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
