function json() {
  return function (req, res, next) {
    const contentType = req.headers["content-type"] || "";
    if (req.method === "POST" && contentType.includes("application/json")) {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          req.body = JSON.parse(body);
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

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
  };
  return types[ext] || "application/octet-stream"; // 알 수 없는 파일은 바이너리로 처리
}

function staticMiddleware(root) {
  return function (req, res, next) {
    const filePath = path.join(root, req.pathname);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const contentType = getContentType(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
      } else {
        next();
      }
    });
  };
}

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

const http = require("http");
const url = require("url");

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
        res.end(JSON.stringify(data)); // ⚠️ 여기서 오류 발생 가능
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

// test
const path = require("path");
const app = createApplication();

// JSON 파서 미들웨어 등록
app.use(json());

// POST 요청 처리 라우터 등록
app.post("/api/echo", (req, res) => {
  res.json({
    received: true,
    body: req.body,
  });
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`📡 JSON 테스트 서버 실행 중: http://localhost:${PORT}`);
});
