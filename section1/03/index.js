// ✅ Node.js의 기본 HTTP 모듈 불러오기
const http = require("http");

// ✅ HTTP 서버 생성 – 요청이 들어올 때마다 콜백 함수 실행
const server = http.createServer((req, res) => {
  // 요청 객체에서 method(GET, POST 등)와 url(/, /about 등)을 구조 분해 할당
  const { url, method } = req;

  // ✅ 라우팅 처리: 요청 메서드와 URL 경로에 따라 다른 응답 반환
  if (method === "GET" && url === "/") {
    // 홈 페이지 요청에 대한 응답
    res.writeHead(200, { "Content-Type": "text/plain" }); // 상태 코드 200 OK 및 헤더 설정
    res.end("🏠 Welcome to Home Page"); // 본문 응답 종료
  } else if (method === "GET" && url === "/about") {
    // 어바웃 페이지 요청에 대한 응답
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("📚 About Us");
  } else {
    // 위 조건에 해당하지 않는 모든 요청에 대해 404 응답
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("❌ Page Not Found");
  }
});

// ✅ 포트 3000번에서 서버 실행 시작
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

/*
📌 향후 라우팅이 많아질 경우 아래처럼 if-else가 길어질 수 있음:

if (method === 'GET' && url === '/') { ... }
else if (method === 'GET' && url === '/about') { ... }
else if (method === 'GET' && url === '/products') { ... }
else if (method === 'GET' && url === '/contact') { ... }
else if (method === 'POST' && url === '/products') { ... }
else if (method === 'PUT' && url === '/products/123') { ... }
else if (method === 'DELETE' && url === '/products/123') { ... }
else {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('❌ Page Not Found');
}

➡️ 이처럼 라우팅 조건이 많아질 경우, 조건문 대신 라우터 객체나 미들웨어 체인 방식으로 분리하는 것이 유지보수에 유리합니다.

📌 Express.js에서는 다음과 같이 깔끔하게 처리합니다:

app.get("/", homeHandler);
app.get("/about", aboutHandler);
app.post("/products", createProductHandler);
app.post("/admin", adminHandler);

➡️ 위 구조를 모방한 Express 스타일의 라우팅 시스템은 추후 직접 구현한 MyExpress 프로젝트에서 학습하게 됩니다.
*/
