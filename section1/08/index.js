// ✅ 1. Node.js 내장 HTTP 모듈 불러오기
const http = require("http");

// ✅ 2. 에러 핸들링 미들웨어 정의 (err, req, res, next 형식)
const errorMiddleware = (err, req, res, next) => {
  console.error("💥 [Error Middleware] 에러 발생:", err.message);
  res.writeHead(500, { "Content-Type": "text/plain" });
  res.end(`Internal Server Error: ${err.message}`);
};

// ✅ 3. 일반 미들웨어 체인 정의
const middlewares = [
  // 🧩 Middleware 1: 요청 수신 및 특정 URL 차단 처리
  (req, res, next) => {
    console.log("🔧 [Middleware 1] 요청 수신");

    // /forbidden 요청은 즉시 403 응답
    if (req.url === "/forbidden") {
      res.writeHead(403, { "Content-Type": "text/plain" });
      return res.end("Access Denied: You cannot access this resource.");
    }

    // 그 외에는 다음 미들웨어로
    next();
  },

  // 🧩 Middleware 2: 의도적으로 에러 발생시키기
  (req, res, next) => {
    console.log("🔧 [Middleware 2] 의도적인 에러 발생");
    throw new Error("Something went wrong in Middleware 2!");
    // 비동기라면: Promise.reject(new Error(...)).catch(next);
  },

  // 🧩 Middleware 3: 모든 조건 통과 시 정상 응답 처리
  (req, res, next) => {
    console.log("🔧 [Middleware 3] 응답 준비");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, everything is fine!");
  },
];

// ✅ 4. 미들웨어 실행 함수 정의
// 요청(req), 응답(res), 일반 미들웨어 배열, 에러 미들웨어를 순서대로 실행합니다.
function runMiddlewares(req, res, middlewares, errorMiddleware) {
  let idx = 0; // 현재 실행 중인 미들웨어 인덱스

  // next는 각 미들웨어가 호출해야 하는 함수입니다.
  function next(err) {
    if (err) {
      // 에러가 발생하면 에러 핸들링 미들웨어로 전달
      return errorMiddleware(err, req, res, next);
    }

    if (idx < middlewares.length) {
      const currentMiddleware = middlewares[idx++];

      try {
        currentMiddleware(req, res, next); // 현재 미들웨어 실행
      } catch (error) {
        // 동기 미들웨어에서 에러 발생 시도시 안전하게 캐치
        next(error); // 다음 next(err)로 전달
      }
    } else {
      // 모든 미들웨어가 성공적으로 실행된 경우
      console.log("✅ 모든 미들웨어 처리가 완료되었습니다.");
    }
  }

  // 실행 시작
  next();
}

// ✅ 5. HTTP 서버 생성 – 요청이 들어오면 미들웨어 체인 실행
const server = http.createServer((req, res) => {
  console.log(`📥 [Request] Method: ${req.method}, URL: ${req.url}`);
  runMiddlewares(req, res, middlewares, errorMiddleware);
});

// ✅ 6. 포트 3000번에서 서버 시작
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

// ✅ 요청: /hello
// → Middleware 1: 통과
// → Middleware 2: throw Error 발생
// → runMiddlewares: catch로 감지 → next(error)
// → errorMiddleware 실행 → 500 Internal Server Error 응답

// ✅ 요청: /forbidden
// → Middleware 1: URL 검사 → 403 Forbidden 응답 → 체인 종료

// ✅ 요청: / (정상)
// → Middleware 1 → Middleware 2: 에러 → errorMiddleware
// → 에러 없는 경우에만 Middleware 3 응답
