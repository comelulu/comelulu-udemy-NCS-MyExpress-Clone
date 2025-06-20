const http = require("http");
const url = require("url");
const path = require("path");
const ejs = require("ejs");
const createRouter = require("./createRouter");

function createApplication() {
  const app = createRouter();
  app.settings = {};

  app.set = function (name, value) {
    app.settings[name] = value;
  };

  app.listen = function () {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      req.pathname = parsedUrl.pathname;
      req.query = parsedUrl.query;
      req.params = {};
      req.body = {};

      res.status = function (code) {
        res.statusCode = code;
        return res;
      };

      res.send = function (data) {
        const type =
          typeof data === "object" ? "application/json" : "text/html";
        res.writeHead(res.statusCode || 200, { "Content-Type": type });
        res.end(typeof data === "object" ? JSON.stringify(data) : data);
      };

      res.json = function (data) {
        res.writeHead(200, { "Content-Type": "application/json" });
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

      app.handle(req, res, (err) => {
        if (err) {
          if (!res.writableEnded) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          }
        } else {
          if (!res.writableEnded) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
          }
        }
      });
    });

    return server.listen.apply(server, arguments);
  };

  return app;
}

module.exports = createApplication;
