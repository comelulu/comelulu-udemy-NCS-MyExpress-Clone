// createRouter.js
// 라우터 생성기: 미들웨어 및 라우팅 등록 + router.handle 포함

const { parse } = require("url");
const matchPath = require("./matchPath");

function createRouter() {
  function router(req, res, next) {
    router.handle(req, res, next);
  }

  router.stack = []; // 요청 처리 레이어 저장소

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
        router.stack.push({
          method,
          path,
          handler,
          isErrorHandler: false,
        });
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
      }

      if (isErrorHandler) return next();

      if (
        method === "use" &&
        (layerPath === "/" || pathname.startsWith(layerPath))
      ) {
        const subPath = pathname.slice(layerPath.length) || "/";
        const origPath = req.pathname;
        const origUrl = req.url;
        req.pathname = subPath;
        req.url = subPath + (parse(origUrl).search || "");

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
        return;
      }

      const m = req.method.toLowerCase();
      if (
        (method === "all" || method === m) &&
        matchPath(layerPath, pathname, req)
      ) {
        return handler(req, res, next);
      }

      next();
    }

    next(); // 체인 시작
  };

  return router;
}

module.exports = createRouter;
