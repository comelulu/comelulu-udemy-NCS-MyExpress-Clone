const path = require("path");
const fs = require("fs");

// ✅ 개선된 정적 파일 제공 미들웨어 (After)

// Before:
// function staticMiddleware(root) {
//   return function (req, res, next) {
//     const filePath = path.join(root, req.pathname);
//     fs.stat(filePath, (err, stats) => {
//       if (!err && stats.isFile()) {
//         const contentType = getContentType(filePath);
//         res.writeHead(200, { "Content-Type": contentType });
//         fs.createReadStream(filePath).pipe(res);
//       } else {
//         next();
//       }
//     });
//   };
// }

function safePath(root, requestPath) {
  // ✅ 개선 1: 경로 조작 방지(Path Traversal 보호)
  // - requestPath가 '../../etc/passwd' 같은 상위 경로 접근 시도를 하면
  //   안전한 root 외부로 빠져나가지 못하게 차단함
  const relative = requestPath.replace(/^\/+/, ""); // 슬래시 제거 후 상대경로로 처리
  const resolved = path.resolve(root, relative); // 절대 경로 변환
  return resolved.startsWith(path.resolve(root)) // root 내부인지 확인
    ? resolved
    : null; // root 외부 경로면 null 반환
}

function staticMiddleware(root) {
  return function (req, res, next) {
    const safe = safePath(root, req.pathname);

    // ✅ 개선 2: root 외부 접근 시도 차단
    // - 안전하지 않은 경로로 요청이 들어오면 즉시 403 응답 반환
    if (!safe) {
      res.status(403).send("Access Denied");
      return;
    }

    fs.stat(safe, (err, stats) => {
      // ✅ 기존과 동일: 요청된 경로가 실제 파일이면 파일 스트림 응답
      if (!err && stats.isFile()) {
        const contentType = getContentType(safe);
        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(safe).pipe(res);
      } else {
        // ✅ 기존과 동일: 파일이 없거나 디렉토리인 경우 다음 미들웨어로 넘김
        next();
      }
    });
  };
}
