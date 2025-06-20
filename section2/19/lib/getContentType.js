// Node.js 내장 모듈 path를 불러옵니다.
// path.extname()은 파일 경로에서 확장자만 추출할 수 있게 해줍니다.
const path = require("path");

// getContentType 함수는 파일 경로(filePath)를 받아,
// 확장자에 따라 적절한 MIME 타입(Content-Type)을 반환합니다.
function getContentType(filePath) {
  // 1. 확장자 추출 (소문자로 변환하여 대소문자 구분 없이 처리)
  const ext = path.extname(filePath).toLowerCase();

  // 2. 확장자와 MIME 타입 매핑 테이블 정의
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
  };

  // 3. 등록된 확장자일 경우 해당 MIME 타입을 반환하고,
  //    등록되지 않은 경우 기본값 'application/octet-stream'을 반환
  return types[ext] || "application/octet-stream";
}

// 다른 파일에서 사용할 수 있도록 모듈로 내보냅니다.
module.exports = getContentType;
