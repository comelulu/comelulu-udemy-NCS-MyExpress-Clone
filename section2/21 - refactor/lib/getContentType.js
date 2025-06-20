const path = require("path");

function getContentType(filePath) {
  const ext = path.extname(filePath).slice(1);
  const types = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    txt: "text/plain",
  };
  return types[ext] || "application/octet-stream";
}

module.exports = getContentType;
