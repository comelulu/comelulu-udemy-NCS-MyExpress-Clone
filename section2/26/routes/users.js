const { Router } = require("../myExpress");

const router = Router();

// GET /api/users
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});

// GET /api/users/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id, name: `User ${id}` });
});

// POST /api/users
router.post("/", (req, res) => {
  const newUser = req.body;
  res.status(201).json({ message: "User created", user: newUser });
});

module.exports = router;
