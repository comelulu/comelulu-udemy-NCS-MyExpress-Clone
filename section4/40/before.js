// ✅ BEFORE 버전 – 기능은 구현되었지만 보안 및 헤더 세부 처리 미흡

function staticMiddleware(root) {
  return function (req, res, next) {
    const filePath = path.join(root, req.pathname); // ❌ 단순 join – 경로 조작 공격에 취약

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const contentType = getContentType(filePath); // ✅ 파일 확장자에 따른 Content-Type 설정
        res.writeHead(200, { "Content-Type": contentType }); // ❌ 보안 헤더 없음
        fs.createReadStream(filePath).pipe(res); // ✅ 정적 파일 스트리밍 전송
      } else {
        next(); // ✅ 파일이 아니면 다음 미들웨어로
      }
    });
  };
}
