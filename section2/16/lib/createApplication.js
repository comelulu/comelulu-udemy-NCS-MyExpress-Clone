// lib/createApplication.js
// MyExpress의 app 객체를 생성하는 팩토리 함수
// 앱 객체 생성기. 내부적으로 createRouter()를 호출해 미들웨어 및 라우팅 기능을 포함한 app을 반환합니다.

const http = require("http");
const url = require("url");
const createRouter = require("./createRouter");

function createApplication() {
  // 라우터 기능을 기반으로 app 객체 생성
  const app = createRouter();

  // 앱 수준 설정 저장소
  app.settings = {};

  // 설정 등록 메서드
  app.set = function (name, value) {
    app.settings[name] = value;
  };

  // 서버 실행 메서드 구현
  app.listen = function (...args) {
    const server = http.createServer((req, res) => {
      // 요청 URL 파싱하여 pathname과 query 객체 저장
      const parsedUrl = url.parse(req.url, true);
      req.pathname = parsedUrl.pathname;
      req.query = parsedUrl.query;

      // 이후 미들웨어에서 채워질 수 있도록 빈 객체로 초기화
      req.params = {};
      req.body = {};

      // 응답 상태 코드 설정 메서드
      res.status = function (code) {
        res.statusCode = code;
        return res; // 체이닝 지원
      };

      // send: 문자열 또는 객체를 응답
      res.send = function (data) {
        const type =
          typeof data === "object" ? "application/json" : "text/html";
        res.writeHead(res.statusCode || 200, { "Content-Type": type });
        res.end(typeof data === "object" ? JSON.stringify(data) : data);
      };

      // json: 무조건 JSON으로 응답
      res.json = function (data) {
        res.writeHead(res.statusCode || 200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(data));
      };

      // 요청 처리 위임 (핵심: 다음 강의에서 handle 구현)
      app.handle(req, res, (err) => {
        if (err) {
          if (!res.writableEnded) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          }
        } else {
          if (!res.writableEnded) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
          }
        }
      });
    });

    return server.listen(...args); // 포트 등 listen 인자 전달
  };

  return app;
}

module.exports = createApplication;
