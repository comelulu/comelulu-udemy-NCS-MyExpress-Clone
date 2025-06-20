const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

function matchPath(routePath, pathname, req) {
  if (!routePath.includes(":"))
    return routePath === pathname || routePath === "*";

  const routeParts = routePath.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (routeParts.length !== pathParts.length) return false;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    const r = routeParts[i];
    const p = pathParts[i];
    if (r.startsWith(":")) {
      params[r.slice(1)] = p;
    } else if (r !== p) {
      return false;
    }
  }
  req.params = params;
  return true;
}

function createRouter() {
  function router(req, res, next) {
    router.handle(req, res, next);
  }

  router.stack = [];

  router.use = function (path, handler) {
    if (typeof handler === "undefined") {
      handler = path;
      path = "/";
    }
    const isErrorHandler = handler.length === 4;
    router.stack.push({ method: "use", path, handler, isErrorHandler });
  };

  const methods = ["get", "post", "put", "patch", "delete", "all"];
  methods.forEach((method) => {
    router[method] = function (path, ...handlers) {
      handlers.forEach((handler) => {
        router.stack.push({ method, path, handler, isErrorHandler: false });
      });
    };
  });

  router.handle = function (req, res, out) {
    let idx = 0;
    const { pathname } = req;

    function next(err) {
      if (idx >= router.stack.length) return out && out(err);

      const layer = router.stack[idx++];
      const { method, path: layerPath, handler, isErrorHandler } = layer;

      if (err) {
        if (
          isErrorHandler &&
          (layerPath === "/" || pathname.startsWith(layerPath))
        ) {
          return handler(err, req, res, next);
        } else {
          return next(err);
        }
      } else {
        if (isErrorHandler) return next();

        if (method === "use") {
          if (layerPath === "/" || pathname.startsWith(layerPath)) {
            const subPath = pathname.slice(layerPath.length) || "/";
            const origPath = req.pathname;
            const origUrl = req.url;

            req.pathname = subPath;
            req.url = subPath + (url.parse(req.url).search || "");

            if (handler.handle && typeof handler.handle === "function") {
              handler.handle(req, res, function (err) {
                req.pathname = origPath;
                req.url = origUrl;
                if (err) return next(err);
                next();
              });
            } else {
              handler(req, res, function (err) {
                req.pathname = origPath;
                req.url = origUrl;
                if (err) return next(err);
                next();
              });
            }
          } else {
            next();
          }
        } else {
          const m = req.method.toLowerCase();
          if (
            (method === "all" || method === m) &&
            matchPath(layerPath, pathname, req)
          ) {
            handler(req, res, next);
          } else {
            next();
          }
        }
      }
    }

    next();
  };

  return router;
}

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
module.exports.Router = createRouter;
