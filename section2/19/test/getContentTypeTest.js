// myExpress/
// ├── lib/
// │   └── getContentType.js        # Content-Type 결정 유틸리티 함수
// └── test/
//     └── getContentTypeTest.js    # 함수 테스트 스크립트

// 우리가 직접 만든 getContentType 유틸리티를 불러옵니다.
const getContentType = require("../lib/getContentType");

// 테스트용 파일 경로들
const testFiles = [
  "/public/index.html",
  "/styles/main.CSS",
  "/scripts/app.js",
  "/assets/logo.PNG",
  "/docs/readme.txt",
  "/downloads/manual.unknown", // 등록되지 않은 확장자
];

// 각 파일에 대해 getContentType을 실행하고 결과 출력
for (const file of testFiles) {
  console.log(`📄 ${file} → ${getContentType(file)}`);
}

// 📌 예상 실행 결과:
// 📄 /public/index.html → text/html
// 📄 /styles/main.CSS → text/css
// 📄 /scripts/app.js → application/javascript
// 📄 /assets/logo.PNG → image/png
// 📄 /docs/readme.txt → text/plain
// 📄 /downloads/manual.unknown → application/octet-stream

// 🧠 추가 설명: application/octet-stream의 의미

// - 이 MIME 타입은 서버가 파일의 정확한 형식을 판단할 수 없거나 의도적으로 알려주지 않겠다는 뜻입니다.
// - 브라우저는 이를 다운로드 대상으로 간주하고 자동으로 저장창을 띄웁니다.
// - 주로 .exe, .bin, .unknown 확장자 또는 확장자가 없는 바이너리 파일에 사용됩니다.
// - 보안 측면에서 매우 중요하며, 알려지지 않은 파일을 렌더링하지 않고 다운로드하게 함으로써 실행 위험을 줄여줍니다.
