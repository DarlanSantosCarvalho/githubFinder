// ================================================
//  GitHub API Service — requisições via Axios
// ================================================

const BASE_URL = 'https://api.github.com'

/** Instância Axios configurada para a API do GitHub. */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/vnd.github+json' },
})

/**
 * Busca dados de um usuário.
 * @param {string} username
 * @returns {Promise<Object>} dados do usuário
 */
export async function getUser(username) {
  const { data } = await api.get(`/users/${username}`)
  return data
}

/**
 * Busca todos os repositórios públicos de um usuário (até 100).
 * A ordenação é feita no cliente para maior controle.
 * @param {string} username
 * @returns {Promise<Array>} lista de repositórios
 */
export async function getUserRepos(username) {
  const { data } = await api.get(`/users/${username}/repos`, {
    params: { per_page: 100 },
  })
  return data
}

/**
 * Busca os dados de um repositório específico.
 * @param {string} username
 * @param {string} repoName
 * @returns {Promise<Object>} dados do repositório
 */
export async function getRepo(username, repoName) {
  const { data } = await api.get(`/repos/${username}/${repoName}`)
  return data
}
