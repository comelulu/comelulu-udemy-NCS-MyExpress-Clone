const path = require("path");
const myExpress = require("./myExpress");

// ✅ 라우터 모듈 로드
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const cartsRouter = require("./routes/carts");
const ordersRouter = require("./routes/orders");
const paymentsRouter = require("./routes/payments");
const reviewsRouter = require("./routes/reviews");

// ✅ 미들웨어 불러오기
const staticMiddleware = require("./middleware/staticMiddleware");
const json = require("./middleware/json");
const urlencoded = require("./middleware/urlencoded");
const logger = require("./middleware/logger");
const loadEnv = require("./middleware/loadEnv");

loadEnv();

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

// 🗂️ API 라우터 마운트
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/reviews", reviewsRouter);

// 🏠 홈 페이지 라우트
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    message: "Welcome to the Express Clone Server!",
  });
});

// ❌ 404 Not Found 핸들러
app.use((req, res, next) => {
  const error = new Error(`경로 ${req.path} 없음`);
  error.status = 404;
  next(error);
});

// ✅ 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error("🔥 [Error Handler]:", err.message);
  const status = err.status || 500;
  res.status(status).send(`❌ Internal Server Error`);
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MyExpress 서버 실행 중: http://localhost:${PORT}`);
});
