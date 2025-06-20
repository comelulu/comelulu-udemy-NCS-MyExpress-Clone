const express = require("../myExpress");
const router = express.Router();

let categories = [];
let nextId = 1;

// let categories = [{ id: 1, name: "InitialCategory" }];
// let nextId = 2;

// ✅ GET - 전체 목록 조회
router.get("/", (_req, res) => {
  res.json(categories);
});

// ✅ GET - 구체적인 경로 먼저
router.get("/:catId", (req, res) => {
  const category = categories.find((c) => c.id == req.params.catId);
  if (!category) return res.status(404).json({ error: "Category not found" });

  res.json(category);
});

// ✅ POST - 새로운 카테고리 등록
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ error: "Category name is required" });

  const category = { id: nextId++, name };
  categories.push(category);
  res.status(201).json(category);
});

// ✅ PATCH - 특정 카테고리 수정
router.patch("/:catId", (req, res) => {
  const category = categories.find((c) => c.id == req.params.catId);
  if (!category) return res.status(404).json({ error: "Category not found" });

  const { name } = req.body;
  if (name !== undefined) category.name = name;
  res.json(category);
});

// ✅ DELETE - 특정 카테고리 삭제
router.delete("/:catId", (req, res) => {
  const idx = categories.findIndex((c) => c.id == req.params.catId);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });

  categories.splice(idx, 1);
  res.json({ message: "Category deleted" });
});

module.exports = router;
