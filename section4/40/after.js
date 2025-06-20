// ✅ AFTER 버전 – 보안 강화 및 헤더 처리 개선

function safePath(root, requestPath) {
  // ✅ 경로 조작 공격 방지: 상대 경로로 변환 후 절대 경로화
  const relative = requestPath.replace(/^\/+/, "");
  const resolved = path.resolve(root, relative);
  return resolved.startsWith(path.resolve(root)) ? resolved : null;
}

function staticMiddleware(root) {
  return function (req, res, next) {
    const safe = safePath(root, req.pathname);

    // ✅ 개선 1: 루트 외부 접근 시도 차단
    if (!safe) {
      res.status(403).send("Access Denied");
      return;
    }

    fs.stat(safe, (err, stats) => {
      if (!err && stats.isFile()) {
        const contentType = getContentType(safe);

        // ✅ 개선 2: Content-Type 설정 + 보안 헤더 추가
        res.setHeader("Content-Type", contentType);
        res.setHeader("X-Content-Type-Options", "nosniff"); // 보안 강화

        // ✅ 개선 3: 응답 코드 명확히 설정
        res.writeHead(200);

        // ✅ 기존과 동일: 정적 파일 전송
        fs.createReadStream(safe).pipe(res);
      } else {
        next();
      }
    });
  };
}
