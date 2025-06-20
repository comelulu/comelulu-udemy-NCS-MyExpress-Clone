const url = require("url");
const matchPath = require("./matchPath");

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

  ["get", "post", "put", "patch", "delete", "all"].forEach((method) => {
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
              handler.handle(req, res, (err) => {
                req.pathname = origPath;
                req.url = origUrl;
                if (err) return next(err);
                next();
              });
            } else {
              handler(req, res, (err) => {
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

module.exports = createRouter;
