// routers/users.js
const express = require("../myExpress");
const router = express.Router();

// 기본 사용자 데이터
let users = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 28 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 34 },
  { id: 3, name: "Charlie", email: "charlie@example.com", age: 22 },
  { id: 4, name: "Diana", email: "diana@example.com", age: 30 },
  { id: 5, name: "Ethan", email: "ethan@example.com", age: 40 },
];
let nextId = 6;

// GET /users - 모든 사용자 조회
router.get("/", (req, res) => {
  res.json(users);
});

// GET /users/:id - 특정 사용자 조회
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
  } else {
    res.json(user);
  }
});

// POST /users - 사용자 생성
router.post("/", (req, res) => {
  const user = { id: nextId++, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

// PUT /users/:id - 사용자 전체 수정
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    res.status(404).json({ error: "User not found" });
  } else {
    const updated = { id: id, ...req.body };
    users[index] = updated;
    res.json(updated);
  }
});

// PATCH /users/:id - 사용자 부분 수정
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
  } else {
    Object.assign(user, req.body);
    res.json(user);
  }
});

// DELETE /users/:id - 사용자 삭제
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    res.status(404).json({ error: "User not found" });
  } else {
    users.splice(index, 1);
    res.json({ message: "User deleted" });
  }
});

module.exports = router;
