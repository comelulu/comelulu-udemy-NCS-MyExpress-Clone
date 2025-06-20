// matchPath.js
// 동적 파라미터 추출과 경로 매칭 처리

function matchPath(routePath, pathname, req) {
  // 1. 정적 경로 or 와일드카드
  if (!routePath.includes(":")) {
    return routePath === pathname || routePath === "*";
  }

  // 2. 경로 분해
  const routeParts = routePath.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  // 길이 불일치 시 바로 false
  if (routeParts.length !== pathParts.length) return false;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const r = routeParts[i];
    const p = pathParts[i];

    if (r.startsWith(":")) {
      const paramName = r.slice(1);
      params[paramName] = p;
    } else {
      if (r !== p) return false;
    }
  }

  // 요청 객체에 파라미터 저장
  req.params = params;
  return true;
}

module.exports = matchPath;
