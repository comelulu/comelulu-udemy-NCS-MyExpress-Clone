const express = require("../myExpress");
const router = express.Router();

// 기본 리뷰 데이터
let reviews = [
  {
    id: 1,
    productId: "1",
    userId: "user1",
    rating: 5,
    comment: "Excellent quality, very satisfied!",
  },
  {
    id: 2,
    productId: "1",
    userId: "user2",
    rating: 4,
    comment: "Works well, but delivery was slow.",
  },
  {
    id: 3,
    productId: "2",
    userId: "user3",
    rating: 5,
    comment: "A must-read for any JavaScript developer.",
  },
  {
    id: 4,
    productId: "3",
    userId: "user1",
    rating: 3,
    comment: "Comfortable, but size runs small.",
  },
  {
    id: 5,
    productId: "5",
    userId: "user2",
    rating: 4,
    comment: "Great for kids, keeps them busy!",
  },
];
let nextId = 6;

// 리뷰 작성
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

// 리뷰 목록 조회
router.get("/:prodId/reviews", (req, res) => {
  const prodReviews = reviews.filter((r) => r.productId == req.params.prodId);
  res.json(prodReviews);
});

// 리뷰 수정
router.patch("/:reviewId", (req, res) => {
  const review = reviews.find((r) => r.id == req.params.reviewId);
  if (!review) return res.status(404).json({ error: "Review not found" });

  const { rating, comment } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  res.json(review);
});

// 리뷰 삭제
router.delete("/:reviewId", (req, res) => {
  const idx = reviews.findIndex((r) => r.id == req.params.reviewId);
  if (idx === -1) return res.status(404).json({ error: "Review not found" });

  reviews.splice(idx, 1);
  res.json({ message: "Review deleted" });
});

module.exports = router;
