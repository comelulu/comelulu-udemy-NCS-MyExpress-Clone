function parseUrlEncoded(body, extended = false) {
  const result = {};
  body.split("&").forEach((pair) => {
    const [rawKey, rawValue] = pair.split("=");
    const key = decodeURIComponent(rawKey || "").replace(/\+/g, " ");
    const value = decodeURIComponent(rawValue || "").replace(/\+/g, " ");

    if (extended && key.includes("[")) {
      const keys = key.split(/\[|\]/).filter(Boolean);
      let current = result;
      while (keys.length > 1) {
        const k = keys.shift();
        if (!current[k]) current[k] = {};
        current = current[k];
      }
      current[keys[0]] = value;
    } else {
      result[key] = value;
    }
  });
  return result;
}

function urlencoded(options = {}) {
  const extended = options.extended || false;

  return function (req, res, next) {
    const contentType = req.headers["content-type"] || "";
    if (
      req.method === "POST" &&
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          req.body = parseUrlEncoded(body, extended);
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

module.exports = urlencoded;
