// routes/apiRouter.js
// 사용자 API 관련 라우트 등록 파일 – /api 접두사 하위에서 동작
// 사용자 관련 RESTful API 라우트 정의

const createRouter = require("../createRouter");
const apiRouter = createRouter();

// GET /api/user - 사용자 정보 조회
apiRouter.use("GET", "/api/user", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("👤 사용자 정보 조회 (GET /api/user)");
});

// POST /api/user - 사용자 생성
apiRouter.use("POST", "/api/user", (req, res) => {
  res.writeHead(201, { "Content-Type": "text/plain" });
  res.end("👤 새로운 사용자 생성 (POST /api/user)");
});

// PUT /api/user/:id - 사용자 정보 수정
apiRouter.use("PUT", "/api/user/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`👤 사용자 정보 수정 (PUT ${req.url})`);
});

// DELETE /api/user/:id - 사용자 삭제
apiRouter.use("DELETE", "/api/user/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`👤 사용자 삭제 (DELETE ${req.url})`);
});

module.exports = apiRouter;
