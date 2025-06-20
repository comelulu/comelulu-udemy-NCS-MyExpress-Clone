app.listen = function () {
  // Node.js 기본 HTTP 서버 생성
  const server = http.createServer((req, res) => {
    // 요청 URL을 파싱하여 pathname과 query 객체로 분리
    const parsedUrl = url.parse(req.url, true);
    req.pathname = parsedUrl.pathname; // ex) "/api/users"
    req.query = parsedUrl.query; // ex) { id: "123" }

    // 기본적으로 채워질 객체 구조 미리 설정
    req.params = {}; // 동적 라우팅에서 사용될 파라미터 정보
    req.body = {}; // body-parser 미들웨어로 채워질 본문 데이터

    // res.status(코드)로 상태 코드 설정 가능하도록 확장
    res.status = function (code) {
      res.statusCode = code;
      return res;
    };

    // res.send(data)로 간단하게 텍스트 또는 JSON 응답 가능
    res.send = function (data) {
      const type = typeof data === "object" ? "application/json" : "text/html";
      res.writeHead(res.statusCode || 200, { "Content-Type": type });
      res.end(typeof data === "object" ? JSON.stringify(data) : data);
    };

    // res.json(data)로 JSON 응답 전용 메서드 제공
    res.json = function (data) {
      res.writeHead(res.statusCode || 200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(data));
    };

    // res.render(view, options)로 EJS 뷰 렌더링 가능
    res.render = function (view, options) {
      const viewsDir = app.settings.views || process.cwd(); // 기본 디렉토리
      const ext = app.settings["view engine"]; // ex) 'ejs'
      const filePath = path.join(viewsDir, `${view}.${ext}`); // 뷰 파일 경로

      // EJS 파일 렌더링 후 응답
      ejs.renderFile(filePath, options || {}, (err, str) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("View Render Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(str);
        }
      });
    };

    // 모든 요청은 app.handle을 통해 라우터/미들웨어 체인으로 전달
    app.handle(req, res, (err) => {
      if (err) {
        // 에러가 발생했지만 아직 응답이 끝나지 않은 경우
        if (!res.writableEnded) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      } else {
        // 핸들러가 없거나 응답을 보내지 않았을 경우 404 처리
        if (!res.writableEnded) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
        }
      }
    });
  });

  // server.listen(PORT, callback) 호출을 arguments 그대로 전달
  // => Express와 동일한 인터페이스 제공
  return server.listen.apply(server, arguments);
};
