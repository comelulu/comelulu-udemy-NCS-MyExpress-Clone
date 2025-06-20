const path = require("path");
const {
  logger,
  json,
  urlencoded,
  static: staticMiddleware,
  loadEnv,
} = require("./myExpress");
const createApplication = require("./myExpress");
const usersRouter = require("./routes/users");

loadEnv();

const app = createApplication();

// 미들웨어 등록
app.use(logger()); // 로그 출력
app.use(json()); // JSON 파서
app.use(urlencoded()); // URL-encoded 파서
app.use(staticMiddleware(path.join(__dirname, "public"))); // 정적 파일

// 라우터 등록
app.use("/api/users", usersRouter); // 분리된 users 라우터

// 기본 페이지
app.get("/", (req, res) => {
  res.send("<h1>Welcome to MyExpress</h1>");
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MyExpress 서버 실행 중: http://localhost:${PORT}`);
});
