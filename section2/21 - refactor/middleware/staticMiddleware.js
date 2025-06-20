const fs = require("fs");
const path = require("path");
const getContentType = require("../lib/getContentType");

function staticMiddleware(root) {
  return function (req, res, next) {
    const filePath = path.join(root, req.path);

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const contentType = getContentType(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
      } else {
        next();
      }
    });
  };
}

module.exports = staticMiddleware;
