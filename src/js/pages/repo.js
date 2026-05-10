import { getRepo } from "../api.js";
import { navigate } from "../router.js";
import { fmtNumber, fmtDate, escHtml } from "../utils.js";

function renderHeader(username) {
  return `
    <header class="site-header">
      <div class="logo" id="header-logo">
        <i class="bi bi-github"></i> Github Finder
      </div>
      <div class="header-search">
        <i class="bi bi-search"></i>
        <input type="text" id="header-input"
               placeholder="Buscar usuário…"
               value="${escHtml(username)}"
               autocomplete="off"
               spellcheck="false" />
        <button class="search-btn" id="header-btn">Buscar</button>
      </div>
    </header>`;
}

function bindHeaderSearch() {
  document
    .getElementById("header-logo")
    ?.addEventListener("click", () => navigate("/"));
  const input = document.getElementById("header-input");
  const btn = document.getElementById("header-btn");
  const search = () => {
    const val = input?.value.trim();
    if (!val) return;
    navigate(`/user/${encodeURIComponent(val)}`);
  };
  btn?.addEventListener("click", search);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") search();
  });
}

export async function renderRepoPage({ params }) {
  const { username, repo: repoName } = params;

  document.getElementById("view").innerHTML = `
    ${renderHeader(username)}
    <div class="repo-detail">
      <nav class="breadcrumb">
        <a href="#/">início</a>
        <span class="sep">/</span>
        <a href="#/user/${encodeURIComponent(username)}">${escHtml(username)}</a>
        <span class="sep">/</span>
        <span class="current">${escHtml(repoName)}</span>
      </nav>
      <div id="detail-area">
        <div class="loading-wrap"><div class="spinner"></div><span>Carregando repositório…</span></div>
      </div>
    </div>
  `;

  bindHeaderSearch();

  try {
    const repo = await getRepo(username, repoName);

    const topics = (repo.topics || []).length
      ? `<div class="topics-wrap">${repo.topics
          .map((t) => `<span class="topic-tag">${escHtml(t)}</span>`)
          .join("")}</div>`
      : "";

    const archived = repo.archived
      ? `<span class="topic-tag" style="background:rgba(227,179,65,.12);color:var(--orange);border-color:rgba(227,179,65,.25)">Arquivado</span>`
      : "";

    document.getElementById("detail-area").innerHTML = `
      <button class="btn-back" id="btn-back">
        <i class="bi bi-arrow-left"></i> Voltar para ${escHtml(username)}
      </button>

      <div class="repo-detail-card">
        <div class="repo-detail-header">
          <div>
            <div class="repo-detail-title">
              <i class="bi bi-journal-code"></i>
              <h1>${escHtml(repo.name)}</h1>
              ${archived}
            </div>
            <p class="repo-detail-desc">
              ${
                repo.description
                  ? escHtml(repo.description)
                  : '<span style="opacity:.4;font-style:italic">Sem descrição</span>'
              }
            </p>
          </div>
          <a href="${escHtml(repo.html_url)}"
             target="_blank"
             rel="noopener noreferrer"
             class="btn-github">
            <i class="bi bi-github"></i> Ver no GitHub
          </a>
        </div>

        <div class="repo-detail-stats">
          <div class="detail-stat">
            <span class="stat-label">Estrelas</span>
            <span class="stat-val orange">${fmtNumber(repo.stargazers_count)}</span>
          </div>
          <div class="detail-stat">
            <span class="stat-label">Forks</span>
            <span class="stat-val blue">${fmtNumber(repo.forks_count)}</span>
          </div>
          <div class="detail-stat">
            <span class="stat-label">Watchers</span>
            <span class="stat-val green">${fmtNumber(repo.watchers_count)}</span>
          </div>
          <div class="detail-stat">
            <span class="stat-label">Issues abertas</span>
            <span class="stat-val">${fmtNumber(repo.open_issues_count)}</span>
          </div>
        </div>

        <div class="repo-detail-meta">
          ${
            repo.language
              ? `
            <span class="meta-item">
              <strong>${escHtml(repo.language)}</strong>
            </span>`
              : ""
          }
          <span class="meta-item">
            <i class="bi bi-calendar3"></i>
            Criado em <strong>${fmtDate(repo.created_at)}</strong>
          </span>
          <span class="meta-item">
            <i class="bi bi-clock-history"></i>
            Atualizado em <strong>${fmtDate(repo.updated_at)}</strong>
          </span>
          <span class="meta-item">
            <i class="bi bi-file-earmark-text"></i>
            Licença: <strong>${escHtml(repo.license?.spdx_id || "—")}</strong>
          </span>
          ${
            repo.size
              ? `<span class="meta-item"><i class="bi bi-hdd"></i><strong>${(repo.size / 1024).toFixed(1)} MB</strong></span>`
              : ""
          }
        </div>

        ${topics}
      </div>
    `;

    document
      .getElementById("btn-back")
      ?.addEventListener("click", () =>
        navigate(`/user/${encodeURIComponent(username)}`),
      );
  } catch (err) {
    const is404 = err?.response?.status === 404;
    document.getElementById("detail-area").innerHTML = `
      <button class="btn-back" id="btn-back-err">
        <i class="bi bi-arrow-left"></i> Voltar
      </button>
      <div class="error-wrap">
        <i class="bi bi-exclamation-triangle"></i>
        <p class="error-title">${is404 ? "Repositório não encontrado" : "Erro ao carregar repositório"}</p>
        <p class="error-msg">${
          is404
            ? `"${escHtml(repoName)}" não encontrado para ${escHtml(username)}.`
            : "Tente novamente mais tarde."
        }</p>
      </div>`;
    document
      .getElementById("btn-back-err")
      ?.addEventListener("click", () =>
        navigate(`/user/${encodeURIComponent(username)}`),
      );
  }
}
