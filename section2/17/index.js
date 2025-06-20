// index.js
// MyExpress 엔진의 진입점으로 createApplication을 외부에 공개합니다.
const createApplication = require("./lib/createApplication");

module.exports = {
  createApplication,
};
