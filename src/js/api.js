const BASE_URL = 'https://api.github.com'

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (!response.ok) {
    const error = new Error(`GitHub API error: ${response.status}`)
    error.response = { status: response.status }
    throw error
  }

  return response.json()
}

export async function getUser(username) {
  return request(`/users/${username}`)
}

export async function getUserRepos(username) {
  return request(`/users/${username}/repos?per_page=100`)
}

export async function getRepo(username, repoName) {
  return request(`/repos/${username}/${repoName}`)
}
