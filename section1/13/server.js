// 📁 최종 디렉토리 구조
// my-express/
// ├── createRouter.js             // 라우터 공장 함수
// ├── server.js                   // 서버 진입점
// └── routes/
//     ├── apiRouter.js            // 사용자 관련 API 라우트
//     └── adminRouter.js          // 관리자 전용 API 라우트

// server.js
// MyExpress 서버 실행 파일 – HTTP 요청을 받아 등록된 라우터로 연결
// MyExpress 서버의 진입점 – 라우터 연결 및 요청 흐름 처리

const http = require("http");
const apiRouter = require("./routes/apiRouter");
const adminRouter = require("./routes/adminRouter");

// 미들웨어 실행기: 요청을 받고 등록된 미들웨어들을 순서대로 실행
function runMiddlewares(req, res, middlewares) {
  let idx = 0;
  function next() {
    if (idx < middlewares.length) {
      const current = middlewares[idx++];
      current(req, res, next);
    }
  }
  next();
}

// 요청 처리 미들웨어 리스트 – 라우터 핸들러 및 로그, 404 처리 포함
const middlewares = [
  // 요청 로그 미들웨어
  (req, res, next) => {
    console.log(`📥 [Request] ${req.method} ${req.url}`);
    next();
  },
  // API 및 관리자 라우터 핸들러 등록
  apiRouter.handle,
  adminRouter.handle,
  // 일치하는 라우트가 없는 경우 404 처리
  (req, res, next) => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("❌ 404 Not Found");
  },
];

// 서버 생성 및 실행
const server = http.createServer((req, res) => {
  runMiddlewares(req, res, middlewares);
});

server.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
});
