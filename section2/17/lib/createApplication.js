// createApplication.js
// 앱 객체 생성, 설정 저장, listen 메서드를 포함합니다.

const http = require("http");
const url = require("url");
const createRouter = require("./createRouter");

function createApplication() {
  const app = createRouter(); // 라우터 기능 포함한 객체
  app.settings = {}; // 설정 저장소

  // 설정 등록 메서드
  app.set = function (name, value) {
    app.settings[name] = value;
  };

  // 서버 실행 메서드
  app.listen = function (...args) {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      req.pathname = parsedUrl.pathname;
      req.query = parsedUrl.query;
      req.params = {};
      req.body = {};

      // 응답 헬퍼 메서드 확장
      res.status = function (code) {
        res.statusCode = code;
        return res;
      };

      res.send = function (data) {
        const type =
          typeof data === "object" ? "application/json" : "text/html";
        res.writeHead(res.statusCode || 200, { "Content-Type": type });
        res.end(typeof data === "object" ? JSON.stringify(data) : data);
      };

      res.json = function (data) {
        res.writeHead(res.statusCode || 200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(data));
      };

      // 요청 처리 시작 (핸들러에 제어 위임)
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

    return server.listen(...args);
  };

  return app;
}

module.exports = createApplication;
