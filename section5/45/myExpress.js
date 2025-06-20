class Application {
  constructor() {
    this.settings = {};
  }

  set(name, value) {
    this.settings[name] = value;
  }

  listen(...args) {
    const server = http.createServer((req, res) => {
      const parsed = url.parse(req.url, true);
      req.pathname = parsed.pathname;
      req.query = parsed.query;
      req.params = {};
      req.body = {};

      res.status = function (code) {
        res.statusCode = code;
        return res;
      };

      res.send = function (data) {
        if (!res.writableEnded) {
          const type =
            typeof data === "object" ? "application/json" : "text/html";
          res.writeHead(res.statusCode || 200, { "Content-Type": type });
          res.end(typeof data === "object" ? JSON.stringify(data) : data);
        }
      };

      res.json = function (data) {
        if (!res.writableEnded) {
          try {
            const json = JSON.stringify(data);
            res.writeHead(res.statusCode || 200, {
              "Content-Type": "application/json",
            });
            res.end(json);
          } catch (err) {
            console.error("🔥 JSON 변환 실패:", err.message);
            res.status(500).end("Internal Server Error");
          }
        }
      };

      res.render = (view, options = {}) => {
        const viewsDir = this.settings.views || process.cwd();
        const ext = this.settings["view engine"] || "ejs";
        const filePath = path.join(viewsDir, `${view}.${ext}`);
        ejs.renderFile(filePath, options, (err, str) => {
          if (err) res.status(500).send("View Render Error");
          else res.status(200).send(str);
        });
      };

      if (!res.writableEnded) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    });

    return server.listen(...args);
  }
}
