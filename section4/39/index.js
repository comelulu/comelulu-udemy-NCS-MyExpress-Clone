app.use((err, req, res, next) => {
  console.error("🔥 [Error Handler]:", err.message);

  // ✅ 개선 1: 응답이 이미 끝난 상태인지 확인
  // - res.end() 또는 res.send()가 이미 호출된 후에는 다시 응답을 보낼 수 없음
  if (!res.writableEnded) {
    // ✅ 개선 2: 예기치 못한 오류를 안전하게 처리
    // - 클라이언트에 500 Internal Server Error 반환
    res.status(500).send("Internal Server Error");
  }
});
