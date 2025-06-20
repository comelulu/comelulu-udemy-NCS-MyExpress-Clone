// ✅ 개선된 JSON 파서 미들웨어 (After)

// Before:
// function json() {
//   return function (req, res, next) {
//     const contentType = req.headers["content-type"] || "";
//     if (req.method === "POST" && contentType.includes("application/json")) {
//       let body = "";
//       req.on("data", (chunk) => (body += chunk));
//       req.on("end", () => {
//         try {
//           req.body = JSON.parse(body);
//         } catch (e) {
//           req.body = {};
//         }
//         next();
//       });
//     } else {
//       next();
//     }
//   };
// }

function json(limit = 1e6) {
  // ✅ 개선 1: Payload 용량 제한 추가 (기본값 1MB)
  // - 공격자가 의도적으로 큰 데이터를 보내 서버 메모리를 고갈시키는 문제를 예방 (DoS 방지)
  // - limit은 바이트 단위이며 기본값은 1e6 = 1,000,000 bytes = 약 1MB

  return function (req, res, next) {
    const type = req.headers["content-type"] || "";

    // ✅ 개선 2: 변수명 간소화 및 명확성 향상
    // - contentType → type으로 축약하면서도 의미 유지

    if (req.method === "POST" && type.includes("application/json")) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;

        // ✅ 개선 3: 실시간 용량 검사 도입
        // - 데이터를 누적하면서 동시에 크기 체크 → 초과 시 즉시 응답 반환
        if (body.length > limit) {
          res.writeHead(413, { "Content-Type": "text/plain" });
          return res.end("Payload Too Large");
        }
      });

      req.on("end", () => {
        try {
          // ✅ 기존과 동일: JSON 파싱 시도
          req.body = JSON.parse(body);
        } catch {
          // ✅ 개선 4: 에러 객체 숨기기 (보안 관점)
          // - try 블록에서 발생한 에러 내용을 외부에 노출하지 않고 빈 객체로 처리
          req.body = {};
        }
        next();
      });
    } else {
      // ✅ 기존과 동일: 해당하지 않으면 다음 미들웨어로 넘김
      next();
    }
  };
}
