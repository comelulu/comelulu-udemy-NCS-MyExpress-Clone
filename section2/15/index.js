// myExpress/
// ├── index.js                     ← 외부에 createApplication 제공
// └── lib/
//     ├── createApplication.js     ← app 객체 생성 + settings 관리 + listen 구현
//     └── createRouter.js          ← 라우터 객체 (다음 강의에서 확장 예정)

// index.js
// MyExpress 엔진 외부 공개용 엔트리 파일
const createApplication = require("./lib/createApplication");

module.exports = {
  createApplication,
};
