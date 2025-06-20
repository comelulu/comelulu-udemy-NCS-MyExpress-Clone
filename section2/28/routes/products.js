const express = require("../myExpress");
const router = express.Router();

// 기본 상품 데이터
let products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 25.99,
    category: "Electronics",
    stock: 100,
    description: "Ergonomic wireless mouse with USB receiver",
  },
  {
    id: 2,
    name: "JavaScript: The Good Parts",
    price: 15.0,
    category: "Books",
    stock: 50,
    description: "A classic programming book by Douglas Crockford",
  },
  {
    id: 3,
    name: "Men's Hoodie",
    price: 39.99,
    category: "Clothing",
    stock: 30,
    description: "Warm and comfortable hoodie for casual wear",
  },
  {
    id: 4,
    name: "Stainless Steel Frying Pan",
    price: 45.5,
    category: "Home & Kitchen",
    stock: 20,
    description: "Durable non-stick pan for all stovetops",
  },
  {
    id: 5,
    name: "LEGO Classic Set",
    price: 59.99,
    category: "Toys",
    stock: 80,
    description: "Creative brick box with 500+ pieces for building fun",
  },
];
let nextId = 6;

// 상품 목록 조회
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

// 상품 등록
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

// 상품 상세 조회
router.get("/:prodId", (req, res) => {
  const prod = products.find((p) => p.id == req.params.prodId);
  if (!prod) return res.status(404).json({ error: "Product not found" });
  res.json(prod);
});

// 상품 수정
router.patch("/:prodId", (req, res) => {
  const prod = products.find((p) => p.id == req.params.prodId);
  if (!prod) return res.status(404).json({ error: "Product not found" });

  const { name, price, category, stock, description } = req.body;
  if (name) prod.name = name;
  if (price !== undefined) prod.price = price;
  if (category) prod.category = category;
  if (stock !== undefined) prod.stock = stock;
  if (description) prod.description = description;
  res.json(prod);
});

// 상품 삭제
router.delete("/:prodId", (req, res) => {
  const idx = products.findIndex((p) => p.id == req.params.prodId);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  products.splice(idx, 1);
  res.json({ message: "Product deleted" });
});

module.exports = router;
