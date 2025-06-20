const express = require("../myExpress");
const router = express.Router();

let orders = [];
let nextId = 1;

// let orders = [
//   {
//     id: 1,
//     userId: 1,
//     productId: 1,
//     quantity: 1,
//     address: "Nowhere",
//     paymentMethod: "card",
//     status: "confirmed",
//   },
// ];
// let nextId = 2;

// ✅ GET - 주문 상세 조회 (더 구체적인 경로 우선)
router.get("/details/:orderId", (req, res) => {
  const order = orders.find((o) => o.id == req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// ✅ GET - 특정 사용자 주문 목록 조회
router.get("/:userId/orders", (req, res) => {
  const userOrders = orders.filter((o) => o.userId == req.params.userId);
  res.json(userOrders);
});

// ✅ POST - 특정 사용자 주문 생성
router.post("/:userId/orders", (req, res) => {
  const { productId, address, paymentMethod } = req.body;
  if (!address || !paymentMethod)
    return res
      .status(400)
      .json({ error: "Address and payment method required" });

  const order = {
    id: nextId++,
    userId: req.params.userId,
    productId,
    address,
    paymentMethod,
    status: "created",
  };
  orders.push(order);
  res.status(201).json(order);
});

// ✅ DELETE - 주문 삭제 (orderId 기준)
router.delete("/:orderId", (req, res) => {
  const idx = orders.findIndex((o) => o.id == req.params.orderId);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });

  orders.splice(idx, 1);
  res.json({ message: "Order cancelled" });
});

module.exports = router;
