import { registerRoute, startRouter } from './router.js'
import { renderHome }     from './pages/home.js'
import { renderUserPage } from './pages/user.js'
import { renderRepoPage } from './pages/repo.js'

registerRoute('/',                          renderHome)
registerRoute('/user/:username',            renderUserPage)
registerRoute('/user/:username/repo/:repo', renderRepoPage)

startRouter()
