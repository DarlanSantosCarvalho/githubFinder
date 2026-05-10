// ================================================
//  Utilitários — formatação e helpers visuais
// ================================================

/** Mapa de linguagem → cor hex (baseado nas cores do GitHub Linguist). */
export const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Java:       '#b07219',
  'C#':       '#178600',
  'C++':      '#f34b7d',
  C:          '#555555',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Ruby:       '#701516',
  PHP:        '#4F5D95',
  Swift:      '#F05138',
  Kotlin:     '#A97BFF',
  Dart:       '#00B4AB',
  Shell:      '#89e051',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  SCSS:       '#c6538c',
  Vue:        '#41b883',
  Svelte:     '#ff3e00',
  Lua:        '#000080',
  R:          '#198CE7',
  Scala:      '#c22d40',
  Haskell:    '#5e5086',
  Elixir:     '#6e4a7e',
  Clojure:    '#db5855',
  default:    '#8b94a3',
}

/**
 * Retorna a cor hex para uma linguagem de programação.
 * @param {string|null} lang
 * @returns {string} cor hex
 */
export function getLangColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.default
}

/**
 * Formata números grandes com sufixo "k".
 * ex: 1200 → "1.2k"
 * @param {number} n
 * @returns {string}
 */
export function fmtNumber(n) {
  if (!n) return '0'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

/**
 * Formata uma data ISO 8601 para o padrão pt-BR.
 * ex: "2024-03-15T00:00:00Z" → "15 de mar. de 2024"
 * @param {string} dateStr
 * @returns {string}
 */
export function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Escapa caracteres HTML especiais para prevenir XSS.
 * @param {string} str
 * @returns {string}
 */
export function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
