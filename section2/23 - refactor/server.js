const path = require("path");
const myExpress = require("./myExpress");

// 미들웨어 불러오기
const staticMiddleware = require("./middleware/staticMiddleware");
const json = require("./middleware/json");

const app = myExpress();

// 설정
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 미들웨어 등록
app.use(staticMiddleware(path.join(__dirname, "public")));
app.use(json());

// 템플릿 렌더링 라우트
app.get("/greet", (req, res) => {
  res.render("greeting", { name: "YongSu" });
});

// JSON 테스트용 POST 라우트
app.post("/api/echo", (req, res) => {
  res.json({
    received: true,
    body: req.body,
  });
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
