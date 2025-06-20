// ✅ Node.js의 기본 HTTP 모듈 불러오기
const http = require("http");

// ✅ HTTP 서버 생성 – 요청이 들어올 때마다 콜백 함수 실행
const server = http.createServer((req, res) => {
  // 클라이언트에게 보낼 응답 헤더 설정
  res.writeHead(200, { "Content-Type": "text/plain" }); // 상태 코드 200 OK, 텍스트 형식 지정
  // 응답 본문 작성 및 연결 종료
  res.end("Hello from Node.js HTTP Server!");
});

// ✅ 서버 시작 – 포트 3000에서 요청을 대기
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
