// lib/createApplication.js
// MyExpress의 앱 객체를 생성하는 팩토리 함수 구현
// MyExpress의 핵심 객체인 app을 생성하는 팩토리 함수. 내부적으로 라우터 기능을 포함하며, 앱 수준 설정을 관리할 수 있도록 settings와 set() 메서드를 제공합니다.

const createRouter = require("./createRouter"); // (다음 강의에서 구현 예정)

function createApplication() {
  // 라우터 객체를 기반으로 app 객체 생성 (use, get, post 등 라우터 기능 포함)
  const app = createRouter();

  // 앱 수준 설정 저장소 (예: view engine, views 등)
  app.settings = {};

  // 설정 정보를 저장하는 메서드
  // 예: app.set("view engine", "ejs");
  app.set = function (name, value) {
    app.settings[name] = value;
  };

  return app;
}

module.exports = createApplication;
