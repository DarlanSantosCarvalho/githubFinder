const routes = {};

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

function parseHash() {
  const hash = window.location.hash.slice(1) || "/";
  const [path, ...rest] = hash.split("?");
  const query = {};
  if (rest.length) {
    rest
      .join("?")
      .split("&")
      .forEach((pair) => {
        const [k, v] = pair.split("=");
        if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
      });
  }
  return { path, query };
}

function dispatch() {
  const { path, query } = parseHash();

  let handler = routes[path];
  let params = {};

  if (!handler) {
    for (const [pattern, fn] of Object.entries(routes)) {
      const keys = [];
      const regexStr = pattern
        .replace(/:([^/]+)/g, (_, key) => {
          keys.push(key);
          return "([^/]+)";
        })
        .replace(/\//g, "\\/");
      const match = path.match(new RegExp(`^${regexStr}$`));
      if (match) {
        handler = fn;
        keys.forEach((k, i) => {
          params[k] = decodeURIComponent(match[i + 1]);
        });
        break;
      }
    }
  }

  if (handler) {
    handler({ params, query });
  } else {
    if (routes["/"]) routes["/"]({ params: {}, query: {} });
  }
}

export function startRouter() {
  window.addEventListener("hashchange", dispatch);
  dispatch();
}
