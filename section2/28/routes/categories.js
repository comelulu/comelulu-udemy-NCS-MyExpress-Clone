const express = require("../myExpress");
const router = express.Router();

// 기본 카테고리 데이터
let categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Clothing" },
  { id: 4, name: "Home & Kitchen" },
  { id: 5, name: "Toys" },
];
let nextId = 6;

// 카테고리 목록 조회
router.get("/", (_req, res) => {
  res.json(categories);
});

// 카테고리 추가
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ error: "Category name is required" });

  const category = { id: nextId++, name };
  categories.push(category);
  res.status(201).json(category);
});

// 카테고리 이름 수정
router.patch("/:catId", (req, res) => {
  const category = categories.find((c) => c.id == req.params.catId);
  if (!category) return res.status(404).json({ error: "Category not found" });

  const { name } = req.body;
  if (name) category.name = name;
  res.json(category);
});

// 카테고리 삭제
router.delete("/:catId", (req, res) => {
  const idx = categories.findIndex((c) => c.id == req.params.catId);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });

  categories.splice(idx, 1);
  res.json({ message: "Category deleted" });
});

module.exports = router;
