// server.js
const express = require("./myExpress");
const app = express.createApplication();

// 전역 미들웨어 등록
app.use((req, res, next) => {
  console.log("요청 URL:", req.url);
  next();
});

// 라우터 등록 예시
app.get("/hello", (req, res) => {
  res.send("Hello from MyExpress!");
});

// 서버 실행
app.listen(3000, () => {
  console.log("🚀 MyExpress 서버가 3000번 포트에서 실행 중입니다.");
});
