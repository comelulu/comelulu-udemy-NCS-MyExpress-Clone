const http = require("http");

const chalk = {
  red: (msg) => `\x1b[41m❌ ${msg}\x1b[0m`,
  green: (msg) => `\x1b[42m✅ ${msg}\x1b[0m`,
};

function logDivider(title) {
  console.log(`\n=== ${title.toUpperCase()} ===`);
}

async function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const result = {
          status: res.statusCode,
          body: (() => {
            try {
              return JSON.parse(data);
            } catch {
              return data;
            }
          })(),
        };

        const status = res.statusCode;
        const label =
          status >= 500
            ? chalk.red(`500 Error`)
            : status === 404
            ? chalk.red(`404 Not Found`)
            : chalk.green(`${status} OK`);
        console.log(`${label} → ${options.method} ${options.path}`);
        if (body) {
          console.log("  ▶ Request Body:", body);
        }
        console.log("  ◀ Response:", result.body);
        resolve(result);
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

(async function runUrlencodedTest() {
  try {
    const host = "localhost",
      port = 3000;

    logDivider("URLENCODED TEST: USERS");
    console.time("Urlencoded Users");

    // ✅ 1. 사용자 생성 (application/x-www-form-urlencoded 방식)
    const userFormBody = `name=FormUser&email=form%40test.com&password=abcd`;
    const res = await request(
      {
        hostname: host,
        port,
        path: "/api/users",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
      userFormBody
    );

    if (!res.body.id) throw new Error("Form User 생성 실패");

    // ✅ 2. 사용자 정보 확인
    await request({
      hostname: host,
      port,
      path: `/api/users/${res.body.id}`,
      method: "GET",
    });

    // ✅ 3. 사용자 삭제
    await request({
      hostname: host,
      port,
      path: `/api/users/${res.body.id}`,
      method: "DELETE",
    });

    console.timeEnd("Urlencoded Users");
    logDivider("✅ URLENCODED 테스트 완료!");
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ 테스트 실패: ${err.message}`);
    process.exit(1);
  }
})();
