// ================================================
//  GitHub Explorer — App Entry Point
//  Registra as rotas e inicializa o router.
// ================================================

import { registerRoute, startRouter } from './router.js'
import { renderHome }     from './pages/home.js'
import { renderUserPage } from './pages/user.js'
import { renderRepoPage } from './pages/repo.js'

// Rotas disponíveis
registerRoute('/',                          renderHome)
registerRoute('/user/:username',            renderUserPage)
registerRoute('/user/:username/repo/:repo', renderRepoPage)

// Inicia o roteador — lê o hash atual e despacha
startRouter()
