// lib/createRouter.js
// 라우터 객체를 생성하는 핵심 모듈입니다. router.use, router.get 등으로 미들웨어 및 라우트 핸들러를 등록할 수 있으며, 내부에 router.handle도 포함됩니다.

function createRouter() {
  // 라우터 함수 자체는 요청이 오면 handle 메서드로 위임
  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // 요청 핸들러 스택 (미들웨어/라우트 핸들러 저장)
  router.stack = [];

  // use: 미들웨어 등록 메서드 (경로 지정 여부에 따라 분기)
  router.use = function (path, handler) {
    if (typeof handler === "undefined") {
      handler = path;
      path = "/";
    }

    // 핸들러가 4개의 인자를 받으면 에러 핸들러로 간주
    const isErrorHandler = handler.length === 4;

    // 스택에 미들웨어 등록
    router.stack.push({
      method: "use",
      path,
      handler,
      isErrorHandler,
    });
  };

  // 지원할 HTTP 메서드 리스트
  const methods = ["get", "post", "put", "patch", "delete", "all"];

  // 각 HTTP 메서드에 대응하는 라우트 등록 메서드 생성
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

  // 요청 처리 메서드 (다음 강의에서 실제 로직 구현 예정)
  router.handle = function (req, res, out) {
    // TODO: stack을 순회하면서 미들웨어/라우트 실행
  };

  return router;
}

module.exports = createRouter;
