// createRouter.js
// 미들웨어/라우터 등록 및 요청 처리 로직(router.handle) 포함

const { parse } = require("url");
const matchPath = require("./matchPath");

function createRouter() {
  function router(req, res, next) {
    router.handle(req, res, next);
  }

  router.stack = []; // 요청 처리 레이어 저장소

  // 미들웨어 등록: path 생략 시 "/"로 처리
  router.use = function (path, handler) {
    if (typeof handler === "undefined") {
      handler = path;
      path = "/";
    }
    const isErrorHandler = handler.length === 4;
    router.stack.push({ method: "use", path, handler, isErrorHandler });
  };

  // HTTP 메서드별 라우트 등록
  const methods = ["get", "post", "put", "patch", "delete", "all"];
  methods.forEach((method) => {
    router[method] = function (path, ...handlers) {
      handlers.forEach((handler) => {
        router.stack.push({ method, path, handler, isErrorHandler: false });
      });
    };
  });

  // 요청 처리 핵심 엔진
  router.handle = function (req, res, out) {
    let idx = 0;
    const { pathname } = req;

    function next(err) {
      if (idx >= router.stack.length) return out && out(err);

      const layer = router.stack[idx++];
      const { method, path: layerPath, handler, isErrorHandler } = layer;

      // 에러 핸들러 실행 조건
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

      // 에러 없는데 에러 핸들러면 skip
      if (isErrorHandler) return next();

      // 미들웨어 처리
      if (
        method === "use" &&
        (layerPath === "/" || pathname.startsWith(layerPath))
      ) {
        const subPath = pathname.slice(layerPath.length) || "/";
        const origPath = req.pathname;
        const origUrl = req.url;
        req.pathname = subPath;
        req.url = subPath + (parse(origUrl).search || "");

        // 서브 라우터인지 확인
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

      // 라우트 핸들러 실행 조건 확인
      const m = req.method.toLowerCase();
      if (
        (method === "all" || method === m) &&
        matchPath(layerPath, pathname, req)
      ) {
        return handler(req, res, next);
      }

      next(); // 다음 레이어로 이동
    }

    next(); // 첫 진입점
  };

  return router;
}

module.exports = createRouter;
