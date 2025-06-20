// matchPath.js
// 경로 일치 여부 및 동적 파라미터 추출 (기본 구현)
// 다음 강의에서 정규표현식 기반으로 고도화 예정

function matchPath(routePath, requestPath, req) {
  // 현재는 완전 일치만 처리 (e.g., "/users" === "/users")
  if (routePath === requestPath) return true;

  // 향후 /users/:id 와 /users/123 같은 매칭은 정규표현식으로 처리 예정
  return false;
}

module.exports = matchPath;
