const express = require("../myExpress");
const router = express.Router();

router.get("/sync", (req, res) => {
  throw new Error("동기 오류 발생");
});

module.exports = router;















