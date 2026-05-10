import { navigate } from "../router.js";

export function renderHome() {
  document.getElementById("view").innerHTML = `
    <div class="home-hero">
      <div class="hero-icon"><i class="bi bi-github"></i></div>
      <h1 class="hero-title">Github Finder</h1>
      <p class="hero-subtitle">Explore perfis, repositórios e estatísticas de qualquer usuário do GitHub.</p>

      <div class="hero-search" id="hero-search-wrap">
        <i class="bi bi-search"></i>
        <input
          type="text"
          id="hero-input"
          placeholder="ex: DarlanSantosCarvalho"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <button id="hero-btn">Procurar</button>
      </div>

      <p class="hero-hint">
        Tente
        <span data-user="DarlanSantosCarvalho">DarlanSantosCarvalho</span>
      </p>
    </div>
  `;

  const input = document.getElementById("hero-input");
  const btn = document.getElementById("hero-btn");

  function search() {
    const val = input.value.trim();
    if (!val) {
      input.focus();
      return;
    }
    navigate(`/user/${encodeURIComponent(val)}`);
  }

  btn.addEventListener("click", search);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") search();
  });
  input.focus();

  document.querySelectorAll(".hero-hint [data-user]").forEach((el) => {
    el.addEventListener("click", () => {
      input.value = el.dataset.user;
      search();
    });
  });
}
