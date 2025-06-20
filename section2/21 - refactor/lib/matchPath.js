function matchPath(routePath, requestPath) {
  const routeParts = routePath.split("/").filter(Boolean);
  const requestParts = requestPath.split("/").filter(Boolean);

  if (routeParts.length !== requestParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const route = routeParts[i];
    const request = requestParts[i];
    if (route.startsWith(":")) {
      const key = route.slice(1);
      params[key] = request;
    } else if (route !== request) {
      return null;
    }
  }

  return { params };
}

module.exports = matchPath;
