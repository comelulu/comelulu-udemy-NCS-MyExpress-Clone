// ✅ 개선된 res.json 메서드 정의 (After)

// Before:
// res.json = function (data) {
//   res.writeHead(200, { "Content-Type": "application/json" });
//   res.end(JSON.stringify(data)); // ⚠️ 여기서 오류 발생 가능
// };

res.json = function (data) {
  // ✅ 개선 1: 이미 응답이 끝났는지 확인
  // - res.end()가 이미 호출된 상태면 중복 응답 방지
  if (!res.writableEnded) {
    try {
      // ✅ 개선 2: JSON.stringify를 try-catch로 감싸기
      // - data에 순환 참조(circular reference) 등 문제가 있을 경우 예외 발생 가능
      const json = JSON.stringify(data);

      // ✅ 개선 3: 상태 코드가 지정되지 않았으면 기본값 200으로 설정
      // - 기존에는 무조건 200이었지만, res.status(201).json(...) 등과 호환되도록 개선
      res.writeHead(res.statusCode || 200, {
        "Content-Type": "application/json",
      });

      res.end(json);
    } catch (err) {
      // ✅ 개선 4: JSON 변환 실패 시 서버 에러 처리
      // - 콘솔에 오류 출력하고 클라이언트에게는 500 상태 반환
      console.error("🔥 JSON 변환 실패:", err.message);
      res.status(500).end("Internal Server Error");
    }
  }
};
