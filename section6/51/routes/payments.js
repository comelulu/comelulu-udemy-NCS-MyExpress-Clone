const express = require("../myExpress");
const router = express.Router();

let payments = [];
let nextId = 1;

// let payments = [
//   {
//     id: 1,
//     orderId: 1,
//     method: "card",
//     cardNumber: "0000-0000-0000-0000",
//     expiry: "12/99",
//     cvc: "000",
//   },
// ];
// let nextId = 2;

// ✅ GET - 결제 상세 조회
router.get("/:payId", (req, res) => {
  const payment = payments.find((p) => p.id == req.params.payId);
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.json(payment);
});

// ✅ POST - 특정 주문에 대해 결제 처리
router.post("/:orderId/pay", (req, res) => {
  const { paymentMethod, cardNumber, expiry, cvc } = req.body;

  if (!paymentMethod) {
    return res.status(400).json({ error: "Payment method required" });
  }

  const payment = {
    id: nextId++,
    orderId: req.params.orderId,
    status: "paid",
    paymentMethod,
    cardNumber,
    expiry,
    cvc,
  };

  payments.push(payment);
  res.status(201).json(payment);
});

module.exports = router;
