// errorTest.js
const http = require("http");

function request(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode, body: data });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

(async () => {
  try {
    console.log("\n[TEST] 비동기 에러 테스트 시작...");
    const res1 = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/errors/async",
      method: "GET",
    });
    console.log("✅ 비동기 에러 응답 상태:", res1.status);
    console.log("   ↳ 응답 내용:", res1.body);

    console.log("\n[TEST] 동기 에러 테스트 시작...");
    const res2 = await request({
      hostname: "localhost",
      port: 3000,
      path: "/api/errors/sync",
      method: "GET",
    });
    console.log("✅ 동기 에러 응답 상태:", res2.status);
    console.log("   ↳ 응답 내용:", res2.body);
  } catch (err) {
    console.error("❌ 테스트 중 에러 발생:", err.message);
  }
})();












