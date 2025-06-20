const express = require("../myExpress");
const router = express.Router();

let products = [];
let nextId = 1;

// let products = [
//   {
//     id: 1,
//     name: "MacBook Pro",
//     category: "electronics",
//     price: 2500,
//   },
// ];
// let nextId = 2;

// ✅ GET: 상품 목록 조회 (카테고리, 정렬, 페이지네이션)
router.get("/", (req, res) => {
  const { category, sort, page = 1, limit = 10 } = req.query;
  let result = [...products];

  if (category) result = result.filter((p) => p.category === category);
  if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (sort === "price_asc") result.sort((a, b) => a.price - b.price);

  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + parseInt(limit));
  res.json(paginated);
});

// ✅ GET: 특정 상품 상세 조회
router.get("/:prodId", (req, res) => {
  const prod = products.find((p) => p.id == req.params.prodId);
  if (!prod) return res.status(404).json({ error: "Product not found" });
  res.json(prod);
});

// ✅ POST: 상품 등록
router.post("/", (req, res) => {
  const { name, price, category, stock, description } = req.body;
  if (!name || price === undefined || !category)
    return res.status(400).json({ error: "Required fields missing" });

  const product = {
    id: nextId++,
    name,
    price,
    category,
    stock: stock || 0,
    description: description || "",
  };
  products.push(product);
  res.status(201).json(product);
});

// ✅ PUT: 상품 정보 전체 수정
router.put("/:prodId", (req, res) => {
  const id = Number(req.params.prodId);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { name, price, category, stock, description } = req.body;
  if (!name || price === undefined || !category) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const updated = {
    id,
    name,
    price,
    category,
    stock: stock || 0,
    description: description || "",
  };
  products[index] = updated;
  res.json(updated);
});

// ✅ PATCH: 상품 정보 일부 수정
router.patch("/:prodId", (req, res) => {
  const prod = products.find((p) => p.id == req.params.prodId);
  if (!prod) return res.status(404).json({ error: "Product not found" });

  const { name, price, category, stock, description } = req.body;
  if (name !== undefined) prod.name = name;
  if (price !== undefined) prod.price = price;
  if (category !== undefined) prod.category = category;
  if (stock !== undefined) prod.stock = stock;
  if (description !== undefined) prod.description = description;

  res.json(prod);
});

// ✅ DELETE: 상품 삭제
router.delete("/:prodId", (req, res) => {
  const idx = products.findIndex((p) => p.id == req.params.prodId);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  products.splice(idx, 1);
  res.json({ message: "Product deleted" });
});

module.exports = router;
