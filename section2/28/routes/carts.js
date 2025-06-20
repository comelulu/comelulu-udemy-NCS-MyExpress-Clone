const express = require("../myExpress");
const router = express.Router();

let carts = {
  user1: [
    { productId: "p1", quantity: 2 },
    { productId: "p2", quantity: 1 },
  ],
  user2: [
    { productId: "p3", quantity: 4 },
    { productId: "p4", quantity: 1 },
    { productId: "p5", quantity: 2 },
  ],
};

// let carts = {}; // { userId: [ { productId, quantity } ] }

// 모든 장바구니 조회
router.get("/", (req, res) => {
  res.json(carts);
});

// 장바구니 조회
router.get("/:userId/cart", (req, res) => {
  const cart = carts[req.params.userId] || [];
  res.json(cart);
});

// 장바구니 상품 추가
router.post("/:userId/cart", (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity)
    return res.status(400).json({ error: "Product ID and quantity required" });

  const userCart = carts[req.params.userId] || [];
  const existing = userCart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    userCart.push({ productId, quantity });
  }
  carts[req.params.userId] = userCart;
  res.status(201).json(userCart);
});

// 장바구니 수량 수정
router.patch("/:userId/cart/:prodId", (req, res) => {
  const userCart = carts[req.params.userId] || [];
  const item = userCart.find((i) => i.productId === req.params.prodId);
  if (!item) return res.status(404).json({ error: "Product not in cart" });

  const { quantity } = req.body;
  if (quantity !== undefined) item.quantity = quantity;
  res.json(userCart);
});

// 장바구니 전체 비우기
router.delete("/:userId/cart", (req, res) => {
  carts[req.params.userId] = [];
  res.json({ message: "Cart cleared" });
});

// 장바구니에서 상품 삭제
router.delete("/:userId/cart/:prodId", (req, res) => {
  const userCart = carts[req.params.userId] || [];
  carts[req.params.userId] = userCart.filter(
    (i) => i.productId !== req.params.prodId
  );
  res.json({ message: "Product removed from cart" });
});

module.exports = router;
