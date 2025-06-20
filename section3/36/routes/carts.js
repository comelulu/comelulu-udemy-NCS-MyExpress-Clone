const express = require("../myExpress");
const router = express.Router();

// { userId: [ { productId, quantity } ] }
let carts = {};

// const userCarts = {
//   1: [
//     { productId: 1, quantity: 1 },
//   ],
// };

// 특정 상품 삭제: /:userId/cart/:prodId
router.delete("/:userId/cart/:prodId", (req, res) => {
  const userCart = carts[req.params.userId] || [];
  carts[req.params.userId] = userCart.filter(
    (i) => i.productId !== req.params.prodId
  );
  res.json({ message: "Product removed from cart" });
});

// 특정 상품 수량 수정: /:userId/cart/:prodId
router.patch("/:userId/cart/:prodId", (req, res) => {
  const userCart = carts[req.params.userId] || [];
  const item = userCart.find((i) => i.productId === req.params.prodId);
  if (!item) return res.status(404).json({ error: "Product not in cart" });

  const { quantity } = req.body;
  if (quantity !== undefined) item.quantity = quantity;
  res.json(userCart);
});

// 장바구니 조회: /:userId/cart
router.get("/:userId/cart", (req, res) => {
  const cart = carts[req.params.userId] || [];
  res.json(cart);
});

// 장바구니에 상품 추가: /:userId/cart
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

// 장바구니 전체 비우기: /:userId/cart
router.delete("/:userId/cart", (req, res) => {
  carts[req.params.userId] = [];
  res.json({ message: "Cart cleared" });
});

module.exports = router;
