// 실제 서버 실행 예시 - 정적 파일과 템플릿 렌더링 포함
const path = require("path");
const express = require("./index");
const staticMiddleware = require("./middleware/staticMiddleware");

const app = express();

// 템플릿 설정 (뷰 폴더와 확장자)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 정적 파일 미들웨어 적용
app.use(staticMiddleware(path.join(__dirname, "public")));

// 테스트 라우트
app.get("/", (req, res) => {
  res.send("🏠 Welcome to Home Page");
});

app.get("/greeting", (req, res) => {
  res.render("greeting", { name: "YongSu" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
