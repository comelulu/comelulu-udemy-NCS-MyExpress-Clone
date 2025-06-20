// ✅ Node.js의 기본 HTTP 모듈 불러오기
const http = require("http");

// ✅ 요청 경로별 핸들러 함수 정의
// 각각의 핸들러는 특정 URL과 메서드(GET, POST 등)에 응답하기 위한 함수입니다.

const getHomeHandler = (req, res) => {
  // 홈 페이지 응답
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is the Home Page");
};

const getAboutHandler = (req, res) => {
  // 어바웃 페이지 응답
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is the About Page");
};

const getContactHandler = (req, res) => {
  // 연락처 페이지 응답
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is the Contact Page");
};

const postSubmitHandler = (req, res) => {
  // 폼 제출에 대한 POST 응답
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Form Submitted Successfully");
};

// ✅ 메서드(GET, POST 등)와 URL 경로를 기준으로 핸들러를 분류한 구조
// 각 HTTP 메서드(GET, POST 등)는 또다시 URL별로 세부 라우트를 정의합니다.
// 이를 통해 if-else 없이 깔끔한 라우팅이 가능합니다.
const handlers = {
  GET: {
    "/": getHomeHandler,
    "/about": getAboutHandler,
    "/contact": getContactHandler,
  },
  POST: {
    "/submit": postSubmitHandler,
  },
};

// ✅ HTTP 서버 생성 – 요청이 들어오면 콜백 함수 실행
const server = http.createServer((req, res) => {
  const { method, url } = req; // 요청의 메서드(GET, POST)와 URL 추출

  // 📌 요청 정보를 로그로 출력하여 흐름을 추적
  console.log(`📥 [Request] Method: ${method}, URL: ${url}`);

  // 요청된 메서드에 해당하는 핸들러 객체 조회 (예: handlers["GET"])
  const methodHandlers = handlers[method];

  // 요청된 URL에 해당하는 실제 핸들러 함수 조회
  // methodHandlers가 존재할 경우에만 접근 (안전한 조건부 접근 방식)
  const handler = methodHandlers && methodHandlers[url];

  if (handler) {
    // 해당 핸들러가 존재하면 실행하여 요청 처리
    handler(req, res);
  } else {
    // 없을 경우 404 상태 코드로 응답
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page Not Found");
  }
});

// ✅ 포트 3000번에서 서버 실행 시작
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
