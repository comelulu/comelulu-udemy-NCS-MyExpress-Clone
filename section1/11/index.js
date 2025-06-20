// ✅ 1. Node.js HTTP 모듈 불러오기
const http = require("http");

// ✅ 2. JSON 파서 미들웨어 구현 (Factory 패턴)
function jsonParser() {
  return function (req, res, next) {
    const contentType = req.headers["content-type"] || "";

    // Content-Type이 application/json이 아니면 바로 다음 미들웨어로
    if (!contentType.includes("application/json")) {
      return next();
    }

    let body = "";

    // 데이터가 chunk 단위로 수신될 때마다 body 문자열에 누적
    req.on("data", (chunk) => {
      body += chunk;
    });

    // 모든 데이터 수신 완료 → JSON 파싱 시도
    req.on("end", () => {
      try {
        req.body = JSON.parse(body); // JSON 문자열 → 객체 변환
        next(); // 다음 미들웨어로 이동
      } catch (e) {
        // JSON 구문 오류 처리
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("❌ Invalid JSON Format");
      }
    });

    // 네트워크 오류 발생 시 처리
    req.on("error", (err) => {
      console.error(
        "💥 [Request Error] 데이터 수신 중 오류 발생:",
        err.message
      );
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("❌ Error while receiving data");
    });
  };
}

// ✅ 3. 미들웨어 배열 구성
const middlewares = [
  jsonParser(), // 본문 JSON 처리 미들웨어

  // POST /users 요청 처리
  (req, res, next) => {
    if (req.method === "POST" && req.url === "/users") {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "✅ User Created",
          data: req.body,
        })
      );
    } else {
      next(); // 조건이 맞지 않으면 다음 미들웨어로
    }
  },

  // 모든 라우트에 대해 404 처리
  (req, res, next) => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  },
];

// ✅ 4. 미들웨어 실행 함수 정의
function runMiddlewares(req, res, middlewares) {
  let idx = 0;

  function next() {
    if (idx < middlewares.length) {
      const current = middlewares[idx++];
      current(req, res, next); // 현재 미들웨어 실행
    } else {
      console.log("✅ 모든 미들웨어 처리가 완료되었습니다.");
    }
  }

  next(); // 첫 번째 미들웨어부터 실행 시작
}

// ✅ 5. HTTP 서버 생성 및 요청 처리 흐름 연결
const server = http.createServer((req, res) => {
  console.log(`📥 [Request] Method: ${req.method}, URL: ${req.url}`);
  runMiddlewares(req, res, middlewares);
});

// ✅ 6. 포트 3000번에서 서버 실행
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

// ✅ 요청 흐름 시각화

// [클라이언트 요청: POST /users]
// 헤더: Content-Type: application/json
// 바디: {"name":"Alice","age":30"}

// 1. jsonParser 미들웨어:
//    - Content-Type 검사 → OK
//    - 'data' 이벤트로 청크 수신 → body 누적
//    - 'end' 이벤트 → JSON.parse → req.body 저장
//    - next() → 다음 미들웨어로

// 2. POST /users 조건 만족 → 응답 반환:
//    {
//      "message": "✅ User Created",
//      "data": { "name": "Alice", "age": 30 }
//    }

// 3. 미들웨어 종료
