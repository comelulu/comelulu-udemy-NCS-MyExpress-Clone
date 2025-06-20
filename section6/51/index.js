const express = require("./myExpress");
const app = express();
const errorRoutes = require("./routes/errors");

app.use("/api/errors", errorRoutes);

app.use((err, req, res, next) => {
  console.error("💥 오류 발생:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});
