const express = require("../myExpress");
const router = express.Router();

let users = [];
let nextId = 1;

// let users = [
//   {
//     id: 1,
//     name: "Alice",
//     email: "alice@test.com",
//     password: "1234",
//   },
// ];
// let nextId = 2;

// ✅ GET: 모든 사용자 조회
router.get("/", (req, res) => {
  res.json(users);
});

// ✅ GET: 특정 사용자 조회
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
  } else {
    res.json(user);
  }
});

// ✅ POST: 사용자 생성
router.post("/", (req, res) => {
  const user = { id: nextId++, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

// ✅ PUT: 사용자 전체 정보 수정 (모든 필드 필요)
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

// ✅ PATCH: 사용자 일부 정보 수정
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

// ✅ DELETE: 사용자 삭제
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
