const BASE_URL = "https://api.github.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/vnd.github+json" },
});

export async function getUser(username) {
  const { data } = await api.get(`/users/${username}`);
  return data;
}

export async function getUserRepos(username) {
  const { data } = await api.get(`/users/${username}/repos`, {
    params: { per_page: 100 },
  });
  return data;
}

export async function getRepo(username, repoName) {
  const { data } = await api.get(`/repos/${username}/${repoName}`);
  return data;
}
