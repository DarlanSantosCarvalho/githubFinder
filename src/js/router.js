// ================================================
//  Hash Router — roteamento client-side via URL hash
//  Suporta rotas estáticas e com parâmetros (:param)
// ================================================

const routes = {}

/**
 * Registra uma rota e seu handler.
 * @param {string} path   - ex: '/user/:username'
 * @param {Function} handler - recebe { params, query }
 */
export function registerRoute(path, handler) {
  routes[path] = handler
}

/**
 * Navega para uma rota programaticamente.
 * @param {string} path - ex: '/user/torvalds'
 */
export function navigate(path) {
  window.location.hash = path
}

/** Lê e parseia o hash atual da URL. */
function parseHash() {
  const hash = window.location.hash.slice(1) || '/'
  const [path, ...rest] = hash.split('?')
  const query = {}
  if (rest.length) {
    rest.join('?').split('&').forEach(pair => {
      const [k, v] = pair.split('=')
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '')
    })
  }
  return { path, query }
}

/** Despacha para o handler correto com base no hash atual. */
function dispatch() {
  const { path, query } = parseHash()

  // Tenta match exato primeiro
  let handler = routes[path]
  let params  = {}

  if (!handler) {
    // Tenta match por padrão com parâmetros (e.g. /user/:username)
    for (const [pattern, fn] of Object.entries(routes)) {
      const keys = []
      const regexStr = pattern
        .replace(/:([^/]+)/g, (_, key) => { keys.push(key); return '([^/]+)' })
        .replace(/\//g, '\\/')
      const match = path.match(new RegExp(`^${regexStr}$`))
      if (match) {
        handler = fn
        keys.forEach((k, i) => { params[k] = decodeURIComponent(match[i + 1]) })
        break
      }
    }
  }

  if (handler) {
    handler({ params, query })
  } else {
    // Fallback para home
    if (routes['/']) routes['/']({ params: {}, query: {} })
  }
}

/** Inicia o router — deve ser chamado uma vez na inicialização da app. */
export function startRouter() {
  window.addEventListener('hashchange', dispatch)
  dispatch()
}
