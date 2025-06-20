const matchPath = require("./matchPath");
const runMiddlewares = require("./runMiddlewares");

function createRouter() {
  const stack = [];

  function use(path, ...handlers) {
    if (typeof path === "function") {
      handlers.unshift(path);
      path = "/";
    }
    stack.push({
      method: "MIDDLEWARE",
      path,
      handlers,
    });
  }

  const methods = ["get", "post", "put", "patch", "delete"];
  methods.forEach((method) => {
    createRouter[method] = function (path, ...handlers) {
      stack.push({
        method: method.toUpperCase(),
        path,
        handlers,
      });
    };
  });

  function handle(req, res) {
    const layers = [];
    for (const layer of stack) {
      if (layer.method === "MIDDLEWARE" || layer.method === req.method) {
        const match = matchPath(layer.path, req.path);
        if (match) {
          req.params = match.params;
          layers.push(...layer.handlers);
        }
      }
    }
    runMiddlewares(layers, req, res);
  }

  return {
    use,
    handle,
    ...methods.reduce((api, method) => {
      api[method] = createRouter[method];
      return api;
    }, {}),
  };
}

module.exports = createRouter;
