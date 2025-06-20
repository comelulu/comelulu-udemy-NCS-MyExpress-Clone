function json() {
  return function (req, res, next) {
    const contentType = req.headers["content-type"] || "";
    if (req.method === "POST" && contentType.includes("application/json")) {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          req.body = {};
        }
        next();
      });
    } else {
      next();
    }
  };
}

module.exports = json;
