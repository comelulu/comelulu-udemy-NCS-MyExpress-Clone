function logger(format = ":method :url :status :response-time ms") {
  return function (req, res, next) {
    const start = Date.now();

    if (!req.originalUrl) req.originalUrl = req.url;

    console.log("req.url: ", req.originalUrl);

    res.on("finish", () => {
      const duration = Date.now() - start;
      const log = format
        .replace(":method", `[${req.method}]`)
        .replace(":url", req.originalUrl)
        .replace(":status", res.statusCode)
        .replace(":response-time", duration);
      console.log(log);
    });

    next();
  };
}

module.exports = logger;
