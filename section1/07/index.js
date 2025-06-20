// ✅ 1. Node.js 내장 HTTP 모듈 불러오기
const http = require("http");

// ✅ 2. 미들웨어 목록 정의
// 각 미들웨어는 요청(req), 응답(res), 다음 미들웨어를 호출하는 next() 함수를 매개변수로 받습니다.
const middlewares = [
  // 🧩 Middleware 1: 요청 수신 로그 및 로그 배열 초기화
  (req, res, next) => {
    console.log("🔧 [Middleware 1] 요청 수신");
    req.processLog = ["Request received"]; // 요청 처리 로그 배열 초기화
    next(); // 다음 미들웨어로 이동
  },

  // 🧩 Middleware 2: 사용자 인증 처리 (모의)
  (req, res, next) => {
    console.log("🔧 [Middleware 2] 사용자 인증 로직");
    req.user = { id: 123, name: "Alice" }; // 사용자 정보 삽입
    req.processLog.push("User authenticated"); // 처리 로그에 인증 완료 기록
    next(); // 다음 미들웨어로 이동
  },

  // 🧩 Middleware 3: 응답 전송
  (req, res, next) => {
    console.log("🔧 [Middleware 3] 응답 준비");
    res.writeHead(200, { "Content-Type": "application/json" }); // JSON 응답 헤더 설정

    // 응답 본문 구성
    const responseBody = {
      message: "Hello from Enhanced Middleware Chain!",
      user: req.user, // 사용자 정보 포함
      log: req.processLog, // 전체 미들웨어 처리 로그 포함
    };

    // JSON 문자열로 응답 종료
    res.end(JSON.stringify(responseBody, null, 2));
    // next() 호출 없음 → 이 미들웨어에서 응답을 종료하기 때문에 다음 단계로 이동하지 않음
  },
];

// ✅ 3. 미들웨어 체인을 실행하는 함수 정의
// 배열에 담긴 미들웨어를 순서대로 실행하며, 각 미들웨어는 반드시 next()를 호출해야 다음으로 넘어갑니다.
function runMiddlewares(req, res, middlewares) {
  let idx = 0; // 현재 실행할 미들웨어 인덱스

  // next 함수는 재귀적으로 호출되어 미들웨어를 순차 실행
  function next() {
    if (idx < middlewares.length) {
      const currentMiddleware = middlewares[idx++];
      currentMiddleware(req, res, next); // 현재 미들웨어 실행
    } else {
      // 모든 미들웨어 처리가 완료되었을 때 로그 출력
      console.log("✅ 모든 미들웨어 처리가 완료되었습니다.");
    }
  }

  next(); // 첫 번째 미들웨어부터 실행 시작
}

// ✅ 4. HTTP 서버 생성 – 요청이 들어오면 runMiddlewares를 통해 미들웨어 실행
const server = http.createServer((req, res) => {
  console.log(`📥 [Request] Method: ${req.method}, URL: ${req.url}`);
  runMiddlewares(req, res, middlewares); // 정의된 미들웨어 체인을 실행
});

// ✅ 5. 서버 리스닝 – 포트 3000번에서 클라이언트 요청 대기
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
