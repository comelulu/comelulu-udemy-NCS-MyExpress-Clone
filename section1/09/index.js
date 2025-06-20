// ✅ 1. 필수 모듈 불러오기
const http = require("http");
const fs = require("fs");
const path = require("path");

// ✅ 2. 정적 파일이 위치한 디렉터리 지정
// 예: ./public/logo.png → 클라이언트 요청이 /logo.png일 때 응답됨
const staticDir = path.join(__dirname, "public");

// ✅ 3. 정적 파일 제공 미들웨어 (Factory 패턴)
// 요청된 파일이 staticDir 내부에 존재하면 응답하고, 없으면 next()로 넘김
function staticMiddleware(staticDir) {
  return (req, res, next) => {
    const filePath = path.join(staticDir, req.url);

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const stream = fs.createReadStream(filePath); // 파일 스트림 생성
        res.writeHead(200, { "Content-Type": getContentType(filePath) }); // 적절한 Content-Type 설정
        stream.pipe(res); // 파일을 스트림으로 응답
      } else {
        next(); // 파일 없으면 다음 미들웨어로 넘김
      }
    });
  };
}

// ✅ 4. 파일 확장자에 따른 Content-Type 결정 헬퍼 함수
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream"; // 알 수 없는 확장자는 일반 바이너리 처리
  }
}

// ✅ 5. 미들웨어 체인 구성
// staticMiddleware는 정적 파일을 처리하고, 다음 미들웨어는 404 응답
const middlewares = [
  staticMiddleware(staticDir), // 정적 파일 제공 미들웨어
  (req, res, next) => {
    // 파일이 없을 경우 404 처리
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found: The requested resource does not exist.");
  },
];

// ✅ 6. 미들웨어 실행 함수
// next()가 호출될 때마다 다음 미들웨어를 순차적으로 실행
function runMiddlewares(req, res, middlewares) {
  let idx = 0;

  function next() {
    const middleware = middlewares[idx++];
    if (middleware) {
      middleware(req, res, next);
    } else {
      // 어떤 미들웨어도 처리하지 않은 경우
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found: No middleware handled the request.");
    }
  }

  next(); // 체인 실행 시작
}

// ✅ 7. 서버 생성 및 요청 처리 시작
const server = http.createServer((req, res) => {
  console.log(`📥 [Request] ${req.method} ${req.url}`);
  runMiddlewares(req, res, middlewares);
});

// ✅ 8. 서버 리스닝 – 포트 3000에서 실행
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

// [클라이언트 요청]     →     [서버 처리 흐름]
// ────────────────────────────────────────────
// GET /style.css         → staticMiddleware()에서 파일 발견 → CSS 파일 스트리밍 응답
// GET /logo.png          → staticMiddleware()에서 파일 발견 → 이미지 파일 응답
// GET /unknown.txt       → staticMiddleware()에서 파일 없음 → 다음 미들웨어로 → 404 응답
