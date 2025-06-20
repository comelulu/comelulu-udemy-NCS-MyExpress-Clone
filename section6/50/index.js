const path = require("path");
const express = require("./myExpress");

// 라우터 모듈 로드
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const cartsRouter = require("./routes/carts");
const ordersRouter = require("./routes/orders");
const paymentsRouter = require("./routes/payments");
const reviewsRouter = require("./routes/reviews");

// ✅ Load Environment Variables from .env
express.loadEnv();
const PORT = process.env.PORT || 3000;

const app = express();

// ✅ Logger 미들웨어
app.use(express.logger(":method :url :status :response-time ms"));

// 📂 뷰 엔진 설정
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 📁 정적 파일 제공
app.use(express.static(path.join(__dirname, "public")));

// ✅ Body Parsers
app.use(express.json()); // JSON 요청 처리
app.use(express.urlencoded({ extended: true })); // URL-Encoded 요청 처리

// 🗂️ API 라우터 마운트
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/reviews", reviewsRouter);

// 🏠 홈 페이지
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    message: "Welcome to the Express Clone Server!",
  });
});

// ❌ 404 핸들러
app.use((req, res, next) => {
  const error = new Error(`경로 ${req.path} 없음`);
  error.status = 404;
  next(error);
});

// ✅ 에러 핸들링
app.use((err, req, res, next) => {
  console.error("🔥 [Error Handler]:", err.message);
  const status = err.status || 500;
  res.status(status).send(`❌ Internal Server Error`);
});

app.use((err, req, res, next) => {
  console.error("🔥 [Error Handler]:", err.message);
  if (!res.writableEnded) {
    res.status(500).send("Internal Server Error");
  }
});

// 🚀 서버 시작
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = server;
