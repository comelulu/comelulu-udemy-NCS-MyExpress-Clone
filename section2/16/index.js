// myExpress/
// ├── index.js                     ← 외부에 createApplication 제공
// └── lib/
//     ├── createApplication.js     ← app 객체 생성, settings 및 listen 포함
//     └── createRouter.js          ← use/get/post 등 라우팅 등록, handle 포함

// index.js
// MyExpress 프레임워크의 엔트리 포인트
const createApplication = require("./lib/createApplication");

module.exports = {
  createApplication,
};
