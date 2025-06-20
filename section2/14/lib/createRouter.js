// lib/createRouter.js
// Router 객체를 생성하는 팩토리 함수 (다음 강의에서 구현 예정)
// createRouter() 함수는 미들웨어 체인과 라우팅을 처리하는 엔진의 핵심 구성 요소로, 다음 강의에서 본격적으로 구현할 예정입니다. 현재 시점에서는 빈 구조로 시작하거나 미리 빈 함수로 작성해 둘 수 있습니다.

function createRouter() {
  // 이후 다음 강의에서 use(), get(), post(), handle() 등을 구현합니다.
  return {
    stack: [], // 미들웨어 및 라우트 핸들러들을 저장할 배열
  };
}

module.exports = createRouter;
