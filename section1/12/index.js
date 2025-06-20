const http = require("http");

// ✅ URL-Encoded 폼 데이터를 파싱하는 미들웨어
function urlEncodedParser(req, res, next) {
  const contentType = req.headers["content-type"];

  // POST 메서드이면서 Content-Type이 폼 데이터인 경우만 처리
  if (
    req.method === "POST" &&
    contentType === "application/x-www-form-urlencoded"
  ) {
    let body = "";

    // 조각 데이터(chunk)를 계속 body에 누적
    req.on("data", (chunk) => {
      body += chunk;
    });

    // 모든 데이터 수신 완료 시 파싱 후 req.body에 저장
    req.on("end", () => {
      req.body = parseUrlEncoded(body);
      next();
    });

    // 데이터 수신 중 오류 발생 시 에러 응답 처리
    req.on("error", (err) => {
      console.error(
        "💥 [Request Error] 데이터 수신 중 오류 발생:",
        err.message
      );
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("❌ Error while receiving data");
    });
  } else {
    // 조건에 해당하지 않으면 다음 미들웨어로 이동
    next();
  }
}

// ✅ URL-Encoded 문자열을 자바스크립트 객체로 변환하는 함수
function parseUrlEncoded(body) {
  return body.split("&").reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    acc[decodeURIComponent(key)] = decodeURIComponent(value);
    return acc;
  }, {});
}

// ✅ 미들웨어 체인을 순차적으로 실행하는 함수
function runMiddlewares(req, res, middlewares) {
  let idx = 0;

  function next() {
    if (idx < middlewares.length) {
      const current = middlewares[idx++];
      current(req, res, next);
    } else {
      console.log("✅ 모든 미들웨어 처리가 완료되었습니다.");
    }
  }

  next();
}

// ✅ 서버에서 사용할 미들웨어 리스트
const middlewares = [
  urlEncodedParser, // 폼 데이터 파서 미들웨어

  // 실제 비즈니스 로직 처리: /register 라우트
  (req, res, next) => {
    if (req.method === "POST" && req.url === "/register") {
      console.log("📦 [Form Data]:", req.body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "Registration Complete",
          received: req.body,
        })
      );
    } else {
      next();
    }
  },

  // 등록되지 않은 라우트에 대한 404 처리
  (req, res, next) => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  },
];

// ✅ HTTP 서버 생성 및 요청 처리 진입점
const server = http.createServer((req, res) => {
  console.log(`📥 [Request] Method: ${req.method}, URL: ${req.url}`);
  runMiddlewares(req, res, middlewares);
});

// ✅ 서버 실행
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
