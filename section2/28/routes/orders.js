const express = require("../myExpress");
const router = express.Router();

// 기본 주문 데이터
let orders = [
  {
    id: 1,
    userId: "user1",
    address: "123 Main St, Seoul",
    paymentMethod: "credit_card",
    status: "created",
  },
  {
    id: 2,
    userId: "user2",
    address: "456 Market St, Busan",
    paymentMethod: "paypal",
    status: "created",
  },
  {
    id: 3,
    userId: "user1",
    address: "123 Main St, Seoul",
    paymentMethod: "bank_transfer",
    status: "created",
  },
  {
    id: 4,
    userId: "user3",
    address: "789 Park Ave, Incheon",
    paymentMethod: "credit_card",
    status: "created",
  },
  {
    id: 5,
    userId: "user2",
    address: "456 Market St, Busan",
    paymentMethod: "credit_card",
    status: "created",
  },
];
let nextId = 6;

// 주문 생성
router.post("/:userId/orders", (req, res) => {
  const { address, paymentMethod } = req.body;
  if (!address || !paymentMethod)
    return res
      .status(400)
      .json({ error: "Address and payment method required" });

  const order = {
    id: nextId++,
    userId: req.params.userId,
    address,
    paymentMethod,
    status: "created",
  };
  orders.push(order);
  res.status(201).json(order);
});

// 주문 목록 조회 (특정 사용자)
router.get("/:userId/orders", (req, res) => {
  const userOrders = orders.filter((o) => o.userId == req.params.userId);
  res.json(userOrders);
});

// 주문 상세 조회
router.get("/details/:orderId", (req, res) => {
  const order = orders.find((o) => o.id == req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// 주문 취소
router.delete("/:orderId", (req, res) => {
  const idx = orders.findIndex((o) => o.id == req.params.orderId);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });

  orders.splice(idx, 1);
  res.json({ message: "Order cancelled" });
});

module.exports = router;
