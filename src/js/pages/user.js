import { getUser, getUserRepos } from "../api.js";
import { navigate } from "../router.js";
import { fmtNumber, escHtml } from "../utils.js";

const PAGE_SIZE = 6;

let currentRepos = [];
let currentSort = "stars";
let currentUser = "";
let visibleCount = PAGE_SIZE;

const sortFns = {
  stars: (a, b) => b.stargazers_count - a.stargazers_count,
  forks: (a, b) => b.forks_count - a.forks_count,
  updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
  name: (a, b) => a.name.localeCompare(b.name),
};

function sortRepos(repos, by) {
  return [...repos].sort(sortFns[by] || sortFns.stars);
}

function repoCardHTML(repo, index) {
  const desc = repo.description
    ? `<p class="repo-desc">${escHtml(repo.description)}</p>`
    : `<p class="repo-desc" style="opacity:.4;font-style:italic">Sem descrição</p>`;

  return `
    <div class="repo-card"
         data-repo="${escHtml(repo.name)}"
         tabindex="0"
         role="button"
         aria-label="Ver detalhes de ${escHtml(repo.name)}"
         style="animation-delay:${index * 0.04}s">
      <div class="repo-name">
        <i class="bi bi-journal-code"></i>
        ${escHtml(repo.name)}
      </div>
      ${desc}
      <div class="repo-footer">
        <span class="repo-stat stars"><i class="bi bi-star-fill"></i>${fmtNumber(repo.stargazers_count)}</span>
        <span class="repo-stat forks"><i class="bi bi-diagram-2"></i>${fmtNumber(repo.forks_count)}</span>
        ${repo.language ? `<span class="repo-lang">${escHtml(repo.language)}</span>` : ""}
      </div>
    </div>`;
}

function renderReposGrid(repos) {
  const sorted = sortRepos(repos, currentSort);
  const grid = document.getElementById("repos-grid");
  const loadBtn = document.getElementById("load-more-wrap");
  if (!grid) return;

  if (!sorted.length) {
    grid.innerHTML = `
      <div class="empty-wrap" style="grid-column:1/-1">
        <i class="bi bi-folder2-open"></i>
        <p>Nenhum repositório público encontrado.</p>
      </div>`;
    if (loadBtn) loadBtn.style.display = "none";
    return;
  }

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  grid.innerHTML = visible.map((repo, i) => repoCardHTML(repo, i)).join("");

  if (loadBtn) {
    loadBtn.style.display = hasMore ? "flex" : "none";
    const btn = loadBtn.querySelector("#btn-load-more");
    if (btn) btn.textContent = `Carregar mais`;
  }

  grid.querySelectorAll(".repo-card").forEach((card) => {
    const goToRepo = () =>
      navigate(
        `/user/${encodeURIComponent(currentUser)}/repo/${encodeURIComponent(card.dataset.repo)}`,
      );
    card.addEventListener("click", goToRepo);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") goToRepo();
    });
  });
}

function profileCardHTML(user) {
  const location = user.location
    ? `<span class="profile-link"><i class="bi bi-geo-alt"></i>${escHtml(user.location)}</span>`
    : "";
  const blog = user.blog
    ? `<a href="${escHtml(user.blog)}" target="_blank" rel="noopener" class="profile-link"><i class="bi bi-link-45deg"></i>${escHtml(user.blog)}</a>`
    : "";
  const twitter = user.twitter_username
    ? `<a href="https://twitter.com/${escHtml(user.twitter_username)}" target="_blank" rel="noopener" class="profile-link"><i class="bi bi-twitter-x"></i>@${escHtml(user.twitter_username)}</a>`
    : "";
  const company = user.company
    ? `<span class="profile-link"><i class="bi bi-building"></i>${escHtml(user.company)}</span>`
    : "";

  return `
    <div class="profile-card">
      <div class="profile-avatar-wrap">
        <img src="${escHtml(user.avatar_url)}" alt="Avatar de ${escHtml(user.login)}" loading="lazy" />
      </div>
      <div class="profile-info">
        <h1>${escHtml(user.name || user.login)}</h1>
        <span class="profile-login">@${escHtml(user.login)}</span>
        ${user.bio ? `<p class="profile-bio">${escHtml(user.bio)}</p>` : ""}
        <div class="profile-stats">
          <span class="stat-item"><i class="bi bi-people"></i><strong>${fmtNumber(user.followers)}</strong> seguidores</span>
          <span class="stat-item"><i class="bi bi-person-check"></i><strong>${fmtNumber(user.following)}</strong> seguindo</span>
          <span class="stat-item"><i class="bi bi-journal-code"></i><strong>${fmtNumber(user.public_repos)}</strong> repositórios</span>
        </div>
        ${
          location || blog || twitter || company
            ? `<div class="profile-links">${location}${company}${blog}${twitter}</div>`
            : ""
        }
      </div>
    </div>`;
}

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
    currentSort = "stars";
    navigate(`/user/${encodeURIComponent(val)}`);
  };
  btn?.addEventListener("click", search);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") search();
  });
}

export async function renderUserPage({ params }) {
  const username = params.username;
  currentUser = username;
  visibleCount = PAGE_SIZE;

  document.getElementById("view").innerHTML = `
    ${renderHeader(username)}
    <div class="profile-page">
      <nav class="breadcrumb">
        <a href="#/">início</a>
        <span class="sep">/</span>
        <span class="current">${escHtml(username)}</span>
      </nav>
      <div id="profile-area">
        <div class="loading-wrap"><div class="spinner"></div><span>Buscando perfil…</span></div>
      </div>
    </div>
  `;

  bindHeaderSearch();

  try {
    const [user, repos] = await Promise.all([
      getUser(username),
      getUserRepos(username),
    ]);
    currentRepos = repos;

    const profileArea = document.getElementById("profile-area");
    if (!profileArea) return;

    profileArea.innerHTML = `
      ${profileCardHTML(user)}
      <section class="repos-section">
        <div class="repos-header">
          <h2>Repositórios <span class="count">${repos.length}</span></h2>
          <div class="sort-controls">
            <span>Ordenar por</span>
            <select class="sort-select" id="sort-select">
              <option value="stars">Mais estrelas</option>
              <option value="forks">Mais forks</option>
              <option value="updated">Atualização recente</option>
              <option value="name">Nome (A–Z)</option>
            </select>
          </div>
        </div>
        <div class="repos-grid" id="repos-grid"></div>
        <div class="load-more-wrap" id="load-more-wrap" style="display:none">
          <button class="btn-load-more" id="btn-load-more">Carregar</button>
        </div>
      </section>
    `;

    renderReposGrid(currentRepos);

    document.getElementById("sort-select").addEventListener("change", (e) => {
      currentSort = e.target.value;
      visibleCount = PAGE_SIZE;
      renderReposGrid(currentRepos);
    });

    document.getElementById("load-more-wrap").addEventListener("click", () => {
      visibleCount += PAGE_SIZE;
      renderReposGrid(currentRepos);
    });
  } catch (err) {
    const profileArea = document.getElementById("profile-area");
    if (!profileArea) return;
    const is404 = err?.response?.status === 404;
    profileArea.innerHTML = `
      <div class="error-wrap">
        <i class="bi bi-exclamation-triangle"></i>
        <p class="error-title">${is404 ? "Usuário não encontrado" : "Erro ao carregar dados"}</p>
        <p class="error-msg">${
          is404
            ? `"${escHtml(username)}" não existe no GitHub.`
            : "Tente novamente. Pode ser um limite de taxa da API."
        }</p>
        <button class="btn-retry" id="btn-retry">Tentar novamente</button>
      </div>`;
    document
      .getElementById("btn-retry")
      ?.addEventListener("click", () => renderUserPage({ params }));
  }
}
