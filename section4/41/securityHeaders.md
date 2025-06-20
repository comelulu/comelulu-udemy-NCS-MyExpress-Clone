# 🛡️ 보안 헤더 미들웨어 구현하기 – `securityHeaders`

MyExpress 서버에서 클라이언트로 응답을 보낼 때, 중요한 보안 설정 중 하나는 바로 **HTTP 보안 응답 헤더**입니다.
이 헤더들은 단 몇 줄의 설정만으로도 아래와 같은 웹 공격을 효과적으로 차단할 수 있습니다:

- **XSS (Cross-Site Scripting)**
- **클릭재킹 (Clickjacking)**
- **MIME 스니핑 (Content-Type Sniffing)**
- **HTTPS 강제 사용**

---

## 🔧 직접 구현한 보안 헤더 미들웨어 예시

다음은 `securityHeaders`라는 이름으로 우리가 직접 구현한 보안 헤더 미들웨어입니다:

```js
// 📄 ./middleware/securityHeaders.js

function securityHeaders(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self';"
  );
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
}

module.exports = securityHeaders;
```

---

## 📌 미들웨어 등록 위치

이 보안 미들웨어는 **모든 라우터와 미들웨어보다 먼저 등록**해야 합니다.

```js
// 📄 index.js

const securityHeaders = require("./middleware/securityHeaders");

app.use(securityHeaders); // ✅ 반드시 최상단에 위치
```

---

## ✅ 설정된 보안 헤더 설명

| 헤더 이름                   | 설명                                                  |
| --------------------------- | ----------------------------------------------------- |
| `Content-Security-Policy`   | 스크립트, 이미지, 리소스 등 허용 범위 제한 (`'self'`) |
| `X-Frame-Options`           | 클릭재킹 방지 (`DENY` → iframe 삽입 차단)             |
| `X-Content-Type-Options`    | MIME 타입 추측 방지 (`nosniff`)                       |
| `Strict-Transport-Security` | HTTPS 강제 연결 (최대 1년 유지 + 서브도메인 포함)     |

---

## 🧠 실무에서는 helmet 모듈 사용하기

직접 보안 헤더를 설정하는 것도 좋은 학습 경험이지만, **실무에서는 검증된 보안 미들웨어를 사용하는 것이 일반적**입니다.
Express 환경에서는 [`helmet`](https://www.npmjs.com/package/helmet)이라는 모듈이 대표적으로 사용됩니다.

### 📦 설치 방법

```bash
npm install helmet
```

### 🚀 사용 예시

```js
const helmet = require("helmet");

app.use(helmet()); // ✅ 보안 헤더 자동 설정
```

`helmet()`은 우리가 직접 설정한 보안 헤더 외에도 다음과 같은 헤더들을 자동으로 포함시켜줍니다:

- `X-DNS-Prefetch-Control`
- `Referrer-Policy`
- `X-XSS-Protection`
- `Expect-CT` 등...

---

## 🧾 정리

- 보안 헤더는 매우 간단하지만 **보안적으로 큰 차이를 만들어냅니다**.
- 실습에서는 `securityHeaders` 미들웨어로 원리를 직접 익히고,
- **실무 환경**에서는 `helmet`을 활용하여 **더 안전하고 빠르게 보안 설정을 적용**하세요.

---
