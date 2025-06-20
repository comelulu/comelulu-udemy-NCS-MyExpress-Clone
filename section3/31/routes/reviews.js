const express = require("../myExpress");
const router = express.Router();

let reviews = [];
let nextId = 1;

// let reviews = [
//   {
//     id: 1,
//     prodId: 1,
//     userId: 1,
//     rating: 5,
//     comment: "Excellent product!",
//   },
// ];
// let nextId = 2;

// ✅ GET: 특정 상품의 모든 리뷰 조회
router.get("/:prodId/reviews", (req, res) => {
  const prodReviews = reviews.filter((r) => r.productId == req.params.prodId);
  res.json(prodReviews);
});

// ✅ POST: 특정 상품에 리뷰 작성
router.post("/:prodId/reviews", (req, res) => {
  const { userId, rating, comment } = req.body;
  if (!userId || !rating)
    return res.status(400).json({ error: "User ID and rating required" });

  const review = {
    id: nextId++,
    productId: req.params.prodId,
    userId,
    rating,
    comment: comment || "",
  };
  reviews.push(review);
  res.status(201).json(review);
});

// ✅ PATCH: 특정 리뷰 수정
router.patch("/:reviewId", (req, res) => {
  const review = reviews.find((r) => r.id == req.params.reviewId);
  if (!review) return res.status(404).json({ error: "Review not found" });

  const { rating, comment } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  res.json(review);
});

// ✅ DELETE: 특정 리뷰 삭제
router.delete("/:reviewId", (req, res) => {
  const idx = reviews.findIndex((r) => r.id == req.params.reviewId);
  if (idx === -1) return res.status(404).json({ error: "Review not found" });

  reviews.splice(idx, 1);
  res.json({ message: "Review deleted" });
});

module.exports = router;
