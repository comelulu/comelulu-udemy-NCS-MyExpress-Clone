// server.js
const express = require("./myExpress");
const app = express.createApplication();

app.listen(3000, () => {
  console.log("🚀 MyExpress 서버가 3000번 포트에서 실행 중입니다!");
});
