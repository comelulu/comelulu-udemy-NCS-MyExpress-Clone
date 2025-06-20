// createRouter.js
// 각 요청을 개별적으로 관리할 수 있는 라우터 객체를 생성하는 공장 함수
// 공장 함수 방식의 라우터 객체 생성기 – use(), handle() 메서드 제공

function createRouter() {
  // 등록된 라우트들을 저장하는 배열 (method, path, handler 객체의 목록)
  const routes = [];

  // 라우트 등록 메서드: GET, POST, PUT 등 HTTP 메서드별 경로와 핸들러를 저장
  function use(method, path, handler) {
    routes.push({ method, path, handler });
  }

  // 요청 처리 메서드: 등록된 라우트 중 현재 요청과 일치하는 핸들러를 찾아 실행
  function handle(req, res, next) {
    const matched = routes.find(
      (route) => route.method === req.method && req.url.startsWith(route.path)
    );
    if (matched) {
      return matched.handler(req, res, next);
    }
    next(); // 일치하는 핸들러가 없으면 다음 미들웨어로 넘김
  }

  // 외부로 use()와 handle()만 노출 – 각각 라우트 등록과 요청 처리 기능 담당
  return { use, handle };
}

module.exports = createRouter;
