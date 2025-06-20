// 기본 HTTP 서버 모듈 불러오기
const http = require("http");

// ✅ 개별 요청 처리 핸들러 정의
const getHome = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is the Home Page");
};

const getAbout = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is the About Page");
};

const getContact = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("This is the Contact Page");
};

// ✅ 라우트 목록 정의 – 요청 메서드와 URL, 핸들러를 객체로 구성
const routes = [
  { method: "GET", url: "/", handler: getHome },
  { method: "GET", url: "/about", handler: getAbout },
  { method: "GET", url: "/contact", handler: getContact },
];

// ✅ 서버 생성 – 요청이 들어오면 라우팅 로직 실행
const server = http.createServer((req, res) => {
  const { url, method } = req;

  // 요청 메서드와 URL이 모두 일치하는 라우트를 찾아 처리
  const route = routes.find((r) => r.method === method && r.url === url);

  if (route) {
    route.handler(req, res); // 핸들러 함수 실행
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page Not Found"); // 일치하는 경로가 없을 때 404 응답
  }
});

// ✅ 서버 포트 3000에서 실행 시작
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

// ------------------------------------------
// 아래는 현재 사용되지 않는 코드로, 유지하려면 목적에 맞게 정리해야 합니다
// ------------------------------------------

// ❌ 잘못된 필드명(path → url) 및 핸들러 참조 오류로 작동하지 않음
/*
routes.push({
  method: "GET",
  path: "/about", // "path" 대신 "url"이어야 함
  handler: aboutHandler, // 정의되지 않은 핸들러
});
*/

// ❌ 현재 서버 구조에서는 사용되지 않는 대체 라우팅 방식 예시
/*
const handlers = {
  GET: {
    "/": getHomeHandler, // 정의되지 않은 핸들러
    "/about": getAboutHandler,
    "/contact": getContactHandler,
  },
  POST: {
    "/submit": postSubmitHandler,
  },
};
*/
