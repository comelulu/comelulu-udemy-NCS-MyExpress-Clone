const http = require("http");
const createRouter = require("./createRouter");
const ejs = require("ejs");
const path = require("path");

function createApplication() {
  const app = createRouter(); // use, handle 메서드 포함
  app.settings = {};

  // 설정 메서드
  app.set = function (key, value) {
    app.settings[key] = value;
  };

  // 응답 확장: send, json, render
  function extendRes(res, app) {
    res.send = function (body) {
      const type = typeof body;
      if (type === "string") {
        res.setHeader("Content-Type", "text/html");
        res.end(body);
      } else if (type === "object") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      } else {
        res.end(body);
      }
    };

    res.json = function (data) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    };

    res.render = function (view, options) {
      const viewsDir = app.settings.views || process.cwd();
      const ext = app.settings["view engine"];
      const filePath = path.join(viewsDir, `${view}.${ext}`);

      ejs.renderFile(filePath, options || {}, (err, str) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("View Render Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(str);
        }
      });
    };
  }

  // 서버 실행
  app.listen = function (port, callback) {
    const server = http.createServer((req, res) => {
      // req 확장
      const [url, query = ""] = req.url.split("?");
      req.path = url;
      req.query = Object.fromEntries(new URLSearchParams(query));

      // res 확장
      extendRes(res, app);

      app.handle(req, res);
    });

    return server.listen(port, callback);
  };

  return app;
}

module.exports = createApplication;
