const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const MyExpress = (function () {
  let instance;

  function matchPath(routePath, pathname) {
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
    return params;
  }

  class Router {
    constructor() {
      this.stack = [];
    }

    use(path = "/", handler) {
      if (typeof handler === "undefined") {
        handler = path;
        path = "/";
      }
      this.stack.push({
        method: "use",
        path,
        handler,
        isErrorHandler: handler.length === 4,
      });
    }

    register(method, path, ...handlers) {
      handlers.forEach((handler) => {
        this.stack.push({ method, path, handler, isErrorHandler: false });
      });
    }

    handle(req, res, out) {
      let idx = 0;
      const { pathname } = req;

      const next = (err) => {
        if (idx >= this.stack.length) return out && out(err);

        const layer = this.stack[idx++];
        const { method, path: layerPath, handler, isErrorHandler } = layer;

        if (err) {
          if (isErrorHandler && pathname.startsWith(layerPath)) {
            return handler(err, req, res, next);
          }
          return next(err);
        }

        if (isErrorHandler) return next();

        if (method === "use" && pathname.startsWith(layerPath)) {
          const subPath = pathname.slice(layerPath.length) || "/";
          const origPath = req.pathname;
          const origUrl = req.url;

          req.pathname = subPath;
          req.url = subPath + (url.parse(req.url).search || "");

          if (handler.handle && typeof handler.handle === "function") {
            return handler.handle(req, res, function (err) {
              req.pathname = origPath;
              req.url = origUrl;
              next(err);
            });
          } else {
            return handler(req, res, function (err) {
              req.pathname = origPath;
              req.url = origUrl;
              next(err);
            });
          }
        }

        const m = req.method.toLowerCase();
        const matchedParams = matchPath(layerPath, pathname);
        if ((method === m || method === "all") && matchedParams !== false) {
          req.params = { ...req.params, ...matchedParams };
          return handler(req, res, next);
        }

        return next();
      };

      next();
    }
  }

  class Application extends Router {
    constructor() {
      super();
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

        this.handle(req, res, (err) => {
          if (!res.writableEnded) {
            if (err) res.status(500).send("Internal Server Error");
            else res.status(404).send("Not Found");
          }
        });
      });

      return server.listen(...args);
    }
  }

  ["get", "post", "put", "delete", "patch", "all"].forEach((method) => {
    Application.prototype[method] = function (path, ...handlers) {
      this.register(method, path, ...handlers);
    };
  });

  function createRouter() {
    const routerInstance = new Router();
    const handler = (req, res, next) => {
      console.log("req.body: ", req.body);
      routerInstance.handle(req, res, next);
    };

    ["use", "get", "post", "put", "delete", "patch", "all"].forEach(
      (method) => {
        handler[method] = function (path, ...handlers) {
          routerInstance.register(method, path, ...handlers);
        };
      }
    );

    handler.handle = routerInstance.handle.bind(routerInstance);

    return handler;
  }

  function createApplication() {
    if (!instance) instance = new Application();
    return instance;
  }

  createApplication.Router = createRouter;

  return createApplication;
})();

module.exports = MyExpress;
module.exports.Router = MyExpress.Router;
