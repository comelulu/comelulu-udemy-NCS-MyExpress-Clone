const path = require("path");
const express = require("./myExpress");

// ✅ 라우터 모듈 로드
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const cartsRouter = require("./routes/carts");
const ordersRouter = require("./routes/orders");
const paymentsRouter = require("./routes/payments");
const reviewsRouter = require("./routes/reviews");

// ✅ 환경 변수 로드
express.loadEnv();
const PORT = process.env.PORT || 3000;

const app = express(); // MyExpress 인스턴스 생성

// ✅ Logger 미들웨어 등록
app.use(express.logger(":method :url :status :response-time ms"));

// 📂 뷰 엔진 설정 (EJS)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 📁 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));

// ✅ Body Parsers 등록
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// 🚀 서버 시작
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
