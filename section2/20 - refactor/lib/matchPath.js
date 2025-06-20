function matchPath(routePath, pathname, req) {
  if (!routePath.includes(":"))
    return routePath === pathname || routePath === "*";

  const routeParts = routePath.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (routeParts.length !== pathParts.length) return false;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    const r = routeParts[i];
    const p = pathParts[i];
    if (r.startsWith(":")) {
      params[r.slice(1)] = p;
    } else if (r !== p) {
      return false;
    }
  }

  req.params = params;
  return true;
}

module.exports = matchPath;
