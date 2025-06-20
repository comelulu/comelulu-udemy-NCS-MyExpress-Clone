// server.js
const express = require("./myExpress");
const app = express.createApplication();

app.get("/users/:id", (req, res) => {
  res.send(`유저 ID: ${req.params.id}`);
});

app.get("/products/:category/:productId", (req, res) => {
  const { category, productId } = req.params;
  res.send(`카테고리: ${category}, 상품 ID: ${productId}`);
});

app.listen(3000, () => {
  console.log("🚀 MyExpress 서버 실행 중 (포트: 3000)");
});

// 이제 MyExpress는 Express.js처럼 다음과 같은 동적 라우팅 요청을 완벽하게 처리할 수 있습니다:

// /users/123 → req.params.id === '123'
// /products/book/456 → req.params = { category: 'book', productId: '456' }
