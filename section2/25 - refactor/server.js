const path = require("path");
const myExpress = require("./myExpress");

// 미들웨어 불러오기
const staticMiddleware = require("./middleware/staticMiddleware");
const json = require("./middleware/json");
const urlencoded = require("./middleware/urlencoded");
const logger = require("./middleware/logger");

const app = myExpress();

// 로깅 미들웨어 등록
app.use(logger());

// 설정
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 미들웨어 등록
app.use(staticMiddleware(path.join(__dirname, "public")));
app.use(json());
app.use(urlencoded({ extended: true }));

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

// 🧪 URL-Encoded 테스트용 POST 라우트
app.post("/form", (req, res) => {
  res.json({
    received: true,
    body: req.body,
  });
});

// ✅ 추가된 폼 렌더링 라우트 (GET)
app.get("/form", (req, res) => {
  res.send(`
    <form method="POST" action="/form-submit">
      <input name="username" placeholder="Username" />
      <input name="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  `);
});

// ✅ 추가된 URL-encoded 처리 라우트 (POST)
app.post("/form-submit", (req, res) => {
  res.json({
    received: true,
    parsedBody: req.body,
  });
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
