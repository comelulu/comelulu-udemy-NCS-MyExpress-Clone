// lib/createRouter.js
// 라우터 객체 생성용 팩토리 함수 (향후 확장 예정)

function createRouter() {
  return {
    stack: [], // 미들웨어 및 라우트 핸들러 저장소
  };
}

module.exports = createRouter;
