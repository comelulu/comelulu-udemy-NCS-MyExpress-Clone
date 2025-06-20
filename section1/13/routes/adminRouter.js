// routes/adminRouter.js
// 관리자 전용 API 라우트 등록 파일 – /admin 접두사 하위에서 동작
// 관리자 대시보드 관련 라우트 정의

const createRouter = require("../createRouter");
const adminRouter = createRouter();

// GET /admin/dashboard - 관리자 대시보드 조회
adminRouter.use("GET", "/admin/dashboard", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("📊 관리자 대시보드 (GET /admin/dashboard)");
});

// POST /admin/dashboard - 대시보드 설정 저장
adminRouter.use("POST", "/admin/dashboard", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("📊 대시보드 설정 저장 (POST /admin/dashboard)");
});

module.exports = adminRouter;
