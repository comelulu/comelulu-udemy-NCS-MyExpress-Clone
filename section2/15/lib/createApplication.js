// lib/createApplication.js
// MyExpress의 핵심 앱 객체를 생성하는 팩토리 함수
// app 객체를 생성하는 팩토리 함수로, 내부에 라우터 역할과 앱 설정 기능, 그리고 app.listen()까지 확장하여 정의합니다.

const http = require("http");
const url = require("url");
const createRouter = require("./createRouter"); // 다음 강의에서 구현

function createApplication() {
  // 라우터 기능을 기반으로 앱 객체 생성
  const app = createRouter();

  // 앱 설정 저장소
  app.settings = {};

  // 앱 설정 등록 메서드
  app.set = function (name, value) {
    app.settings[name] = value;
  };

  // 서버 실행 메서드
  app.listen = function (...args) {
    const server = http.createServer((req, res) => {
      // 요청 URL을 파싱하여 pathname과 query 객체로 나눠 저장
      const parsedUrl = url.parse(req.url, true);
      req.pathname = parsedUrl.pathname;
      req.query = parsedUrl.query;

      // 추후 동적 라우팅과 본문 파싱을 위해 미리 빈 객체로 초기화
      req.params = {};
      req.body = {};

      // 응답 상태 코드 설정 메서드
      res.status = function (code) {
        res.statusCode = code;
        return res; // 체이닝 지원
      };

      // 데이터를 HTML 또는 JSON으로 자동 응답하는 메서드
      res.send = function (data) {
        const type =
          typeof data === "object" ? "application/json" : "text/html";
        res.writeHead(res.statusCode || 200, { "Content-Type": type });
        res.end(typeof data === "object" ? JSON.stringify(data) : data);
      };

      // JSON 전용 응답 메서드
      res.json = function (data) {
        res.writeHead(res.statusCode || 200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(data));
      };

      // 요청 처리의 다음 단계 (다음 강의에서 구현 예정)
      // app.handle(req, res);
    });

    // http.Server의 listen 메서드를 그대로 위임
    return server.listen(...args);
  };

  return app;
}

module.exports = createApplication;
