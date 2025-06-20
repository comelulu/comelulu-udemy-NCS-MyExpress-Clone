// myExpress/
// ├── index.js                 ← 엔진의 진입점, createApplication 내보냄
// └── lib/
//     ├── createApplication.js ← app 객체 생성: Router 기능 + 설정 기능 포함
//     └── createRouter.js      ← 라우터 객체 생성 (다음 강의에서 실제 구현)

// index.js
// MyExpress 엔진의 메인 진입점: createApplication을 외부에 공개
const createApplication = require("./lib/createApplication");

module.exports = {
  createApplication,
};
