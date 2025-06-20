// ✅ Node.js의 내장 HTTP 모듈 불러오기
const http = require("http");

// ✅ 미들웨어 체인을 배열 형태로 정의
// 각 미들웨어는 (req, res, next) 형식으로 작성되며, 순서대로 실행됩니다.
const middlewares = [
  // 🧩 미들웨어 1: 요청 수신 로그 및 초기 로깅 배열 생성
  (req, res, next) => {
    console.log("🔧 [Middleware 1] 요청 수신");
    req.processLog = ["Request received"]; // 요청 처리 로그를 저장할 배열 생성
    next(); // 다음 미들웨어로 이동
  },

  // 🧩 미들웨어 2: 사용자 인증 정보 추가
  (req, res, next) => {
    console.log("🔧 [Middleware 2] 사용자 인증 로직");
    req.user = { id: 123, name: "Alice" }; // 요청 객체에 사용자 정보 추가
    req.processLog.push("User authenticated"); // 인증 과정 로깅
    next(); // 다음 미들웨어로 이동
  },

  // 🧩 미들웨어 3: 응답 전송
  (req, res, next) => {
    console.log("🔧 [Middleware 3] 응답 준비");
    // 응답 헤더 설정
    res.writeHead(200, { "Content-Type": "application/json" });

    // 응답 본문 구성
    const responseBody = {
      message: "Hello from Enhanced Middleware Chain!",
      user: req.user, // 이전 미들웨어에서 설정된 사용자 정보
      log: req.processLog, // 전체 처리 로그
    };

    // JSON 문자열로 변환 후 응답 종료
    res.end(JSON.stringify(responseBody, null, 2));
  },
];

// ✅ 미들웨어 체인을 실행하는 유틸리티 함수
// 순차적으로 middlewares 배열을 순회하면서 next()를 통해 다음 미들웨어 호출
function runMiddlewares(req, res, middlewares) {
  let idx = 0; // 현재 실행할 미들웨어의 인덱스

  function next() {
    if (idx < middlewares.length) {
      const currentMiddleware = middlewares[idx++];
      currentMiddleware(req, res, next); // 현재 미들웨어 실행
    } else {
      // 모든 미들웨어 실행이 완료된 경우
      console.log("✅ 모든 미들웨어 처리가 완료되었습니다.");
    }
  }

  next(); // 최초 미들웨어 실행 시작
}

// ✅ HTTP 서버 생성 – 요청이 들어오면 미들웨어 체인을 실행
const server = http.createServer((req, res) => {
  console.log(`📥 [Request] Method: ${req.method}, URL: ${req.url}`);
  runMiddlewares(req, res, middlewares); // 요청마다 미들웨어 실행
});

// ✅ 포트 3000번에서 서버 실행 시작
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
