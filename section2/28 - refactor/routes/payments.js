const express = require("../myExpress");
const router = express.Router();

// 기본 결제 데이터
let payments = [
  {
    id: 1,
    orderId: "1",
    status: "paid",
    paymentMethod: "credit_card",
    cardNumber: "1111-2222-3333-4444",
  },
  {
    id: 2,
    orderId: "2",
    status: "paid",
    paymentMethod: "paypal",
    cardNumber: null,
  },
  {
    id: 3,
    orderId: "3",
    status: "paid",
    paymentMethod: "bank_transfer",
    cardNumber: null,
  },
  {
    id: 4,
    orderId: "4",
    status: "paid",
    paymentMethod: "credit_card",
    cardNumber: "5555-6666-7777-8888",
  },
  {
    id: 5,
    orderId: "5",
    status: "paid",
    paymentMethod: "credit_card",
    cardNumber: "9999-0000-1111-2222",
  },
];
let nextId = 6;

// 결제 요청
router.post("/:orderId/pay", (req, res) => {
  const { paymentMethod, cardNumber, expiry, cvc } = req.body;
  if (!paymentMethod)
    return res.status(400).json({ error: "Payment method required" });

  const payment = {
    id: nextId++,
    orderId: req.params.orderId,
    status: "paid",
    paymentMethod,
    cardNumber,
  };
  payments.push(payment);
  res.status(201).json(payment);
});

// 결제 상태 조회
router.get("/:payId", (req, res) => {
  const payment = payments.find((p) => p.id == req.params.payId);
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.json(payment);
});

module.exports = router;
