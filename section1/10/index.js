// ✅ 1. Node.js 기본 HTTP 모듈 불러오기
const http = require("http");

// ✅ 2. 동적 라우트 정보를 저장할 배열 선언
// 각 라우트는 method, parts, paramNames, handler 형태로 저장됩니다.
const routes = [];

// ✅ 3. 라우트 등록 함수 정의
// pathPattern을 "/users/:id" 형태로 받아 내부적으로 조각 단위로 분해합니다.
function addRoute(method, pathPattern, handler) {
  const parts = pathPattern.split("/").filter(Boolean); // ['users', ':id']
  const paramNames = parts
    .filter((p) => p.startsWith(":"))
    .map((p) => p.slice(1)); // ['id']
  routes.push({ method, parts, paramNames, handler }); // 구조화된 라우트 정보 저장
}

// ✅ 4. 라우트 매칭 함수 정의
// 클라이언트 요청 URL과 등록된 라우트들을 비교하여 일치 여부 확인 및 파라미터 추출
function matchRoute(method, url) {
  const urlParts = url.split("/").filter(Boolean); // 요청 URL → ['users', '123']

  for (const route of routes) {
    if (route.method !== method || route.parts.length !== urlParts.length)
      continue;

    const params = {};
    let matched = true;

    for (let i = 0; i < route.parts.length; i++) {
      const routePart = route.parts[i];
      const urlPart = urlParts[i];

      if (routePart.startsWith(":")) {
        const paramName = routePart.slice(1); // ':id' → 'id'
        params[paramName] = urlPart; // params['id'] = '123'
      } else if (routePart !== urlPart) {
        matched = false;
        break;
      }
    }

    if (matched) return { handler: route.handler, params }; // 매칭 성공 시 핸들러 및 파라미터 반환
  }

  return null; // 어떤 라우트와도 일치하지 않을 경우
}

// ✅ 5. 요청 처리 핸들러 함수 정의
// 추출된 파라미터 객체(params)를 통해 동적으로 응답을 생성합니다.
function handleUserDetail(req, res, params) {
  const userId = params.id;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: `User Detail for ID: ${userId}` }));
}

// ✅ 6. 라우트 등록
// /users/:id 경로로 들어온 GET 요청을 handleUserDetail 함수와 연결
addRoute("GET", "/users/:id", handleUserDetail);

// ✅ 7. HTTP 서버 생성 및 요청 수신 처리
const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(`📥 [Request] ${method} ${url}`);

  const match = matchRoute(method, url); // URL 분석 및 라우트 탐색

  if (match) {
    match.handler(req, res, match.params); // 일치 시 핸들러 호출
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found"); // 라우트가 없을 경우
  }
});

// ✅ 8. 포트 3000에서 서버 실행 시작
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

// 1. matchRoute 호출
//    → urlParts = ['users', '123']
//    → route.parts = ['users', ':id']
//    → 매칭 성공
//    → params = { id: '123' }

// 2. match.handler = handleUserDetail
//    → 응답: { "message": "User Detail for ID: 123" }

// 요청: GET /users 또는 GET /products/123

// 1. route.parts.length !== urlParts.length → 매칭 실패
// 2. 404 Not Found 반환
