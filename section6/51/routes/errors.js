const express = require("../myExpress");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

router.get("/sync", (req, res) => {
  throw new Error("동기 오류 발생");
});

router.get(
  "/async",
  wrapAsync(async (req, res) => {
    throw new Error("비동기 오류 발생");
  })
);

module.exports = router;










