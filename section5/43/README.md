# ✅ MyExpress 아키텍처 개선 – IIFE와 Singleton 패턴: 개념, 목적, 코드 레벨 적용 원리까지 완벽히 이해하기

MyExpress 엔진을 실무에서도 안전하게 사용하려면 단순히 기능 구현을 넘어서 **구조적 안정성**, **상태 일관성**, **보안성**, **예측 가능성**까지 갖추어야 합니다. 이번 자료에서는 이를 가능하게 해주는 두 가지 핵심 기술, 즉 **IIFE (즉시 실행 함수)** 와 **Singleton 패턴**을 이론과 실제 코드 적용 관점에서 깊이 있게 설명합니다.

---

## 📘 IIFE (Immediately Invoked Function Expression)

### ✅ 개념 설명

IIFE란 **함수를 정의하자마자 즉시 실행되는 표현식**입니다. 일반적으로 자바스크립트에서는 함수를 선언해두고, 필요할 때 나중에 호출해서 실행하지만, IIFE는 선언과 동시에 즉시 실행되며, 그 결과는 변수에 저장하거나 외부에 노출하지 않아도 됩니다.

---

### 📎 일반 함수와의 비교

```js
// 일반 함수 선언 및 호출
function greet() {
  console.log("안녕하세요!");
}
greet(); // 필요할 때 호출하여 실행
```

이 방식에서는 함수가 전역 컨텍스트에 존재하기 때문에 다른 코드에서 우연히 `greet`를 재정의하거나 호출 순서가 어긋나면 문제 발생 가능성이 있습니다.

---

```js
// IIFE: 즉시 실행
(function () {
  console.log("안녕하세요, IIFE!");
})(); // 함수가 정의되자마자 실행됨
```

이 코드는 다음과 같은 방식으로 해석됩니다:

- `(function () { ... })` 부분은 함수 선언을 **하나의 표현식(expression)** 으로 만들어줍니다.
- 그 뒤에 오는 `()`는 해당 함수를 **즉시 호출(invoke)** 하는 연산자입니다.
- 실행 이후에는 함수 스코프 내부의 변수들이 **자동으로 사라지거나 은닉됩니다**.

---

### 🎯 왜 사용하는가? – 스코프 은닉화

```js
const counter = (function () {
  let count = 0;

  return {
    up() {
      return ++count;
    },
    down() {
      return --count;
    },
    show() {
      return count;
    },
  };
})();
```

#### 🔍 코드 분석

- `let count = 0;`
  → `count` 변수는 외부에서 접근 불가한 **폐쇄된 스코프 내부에만 존재**합니다. 따라서 직접 수정하거나 삭제할 수 없습니다.

- `return { ... }`
  → 외부로는 `up`, `down`, `show`라는 세 가지 메서드만 노출됩니다. 이 메서드들은 내부적으로 `count`에 접근할 수 있지만 외부에서는 접근 불가능합니다.

- 즉, 이 구조는 **외부에서는 건드릴 수 없는 내부 상태를 안전하게 은닉**하고, **제어 가능한 API만 외부로 제공**하는 형태입니다.

#### 🧪 결과

```js
console.log(counter.up()); // 1
console.log(counter.up()); // 2
console.log(counter.show()); // 2
console.log(counter.count); // undefined
```

`counter.count`는 외부에서는 존재하지 않으며 접근 자체가 불가능합니다.

> 💡 이 패턴은 **데이터 무결성 보장, 보안성 강화, 함수 간 충돌 최소화**에 매우 유용합니다.

---

## 📘 Singleton 패턴

### ✅ 개념 설명

Singleton은 애플리케이션 전역에서 **단 하나의 인스턴스만 생성되도록 보장하는 설계 패턴**입니다. 이는 중요한 설정이나 리소스(예: DB 연결, 서버 인스턴스 등)를 **중복 없이 공유**할 필요가 있을 때 사용합니다.

---

### 📎 일반적인 객체 생성 방식의 문제

```js
function App() {
  this.name = "MyApp";
}
const a1 = new App();
const a2 = new App();
console.log(a1 === a2); // false
```

- 위 코드는 `App()` 생성자를 통해 객체를 두 번 호출합니다.
- `a1`과 `a2`는 서로 다른 메모리 공간에 존재하므로 **상태가 일관되지 않습니다**.

---

### ✅ Singleton 구조 예시

```js
const Singleton = (function () {
  let instance;

  function createInstance() {
    return { name: "MyApp" };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
```

#### 🔍 코드 분석

- `let instance;`
  → 인스턴스를 저장할 변수입니다. 단 하나만 생성됩니다.

- `createInstance()`
  → 실제 객체 생성 로직. 한 번만 실행됩니다.

- `getInstance()`
  → 외부에서 인스턴스를 요청할 때 사용하며, `instance`가 이미 있다면 새로 만들지 않고 기존 것을 반환합니다.

#### 🧪 결과

```js
const app1 = Singleton.getInstance();
const app2 = Singleton.getInstance();
console.log(app1 === app2); // true
```

항상 동일한 인스턴스가 반환되므로 **상태 일관성과 자원 공유가 완벽히 보장**됩니다.

---

## 🧩 왜 MyExpress에 필요한가?

### 📎 기존 구조의 문제점

```js
const app1 = createApplication();
const app2 = createApplication();
```

- `createApplication()`을 호출할 때마다 **서로 다른 인스턴스**가 생성됩니다.
- 개발자가 인증 미들웨어를 `app1`에 등록해놓고 실수로 `app2.listen()`을 호출하면 다음과 같은 문제가 발생합니다:

```js
app1.use(authMiddleware);
app2.listen(3000);
```

- `authMiddleware`는 요청에 적용되지 않음
- 인증 없이 누구나 서버에 접근 가능 → **보안 사고**

---

## ⚠️ 실무에서 실제로 일어나는 문제들

- 인증 미들웨어 누락
- 로그 기록 실패
- 데이터 검증 스킵
- 환경 변수 설정 누락
- DB 연결 객체가 없는 인스턴스에서 API 실행 → 서버 오류

이러한 문제는 **인스턴스가 여러 개 생성되고, 개발자가 어떤 인스턴스를 기준으로 사용하는지 불명확할 때** 발생합니다.

---

## ✅ IIFE + Singleton을 도입하면 생기는 변화

| 문제           | 개선 전 구조                      | 개선 후 구조                       |
| -------------- | --------------------------------- | ---------------------------------- |
| 인스턴스 중복  | 언제든 새로 생성됨                | 단 하나만 생성됨                   |
| 설정 변경 위험 | 외부에서 `app.settings = {}` 가능 | 내부 은닉으로 수정 불가            |
| 미들웨어 누락  | 인스턴스마다 등록 상태 다름       | 하나의 공유 인스턴스에만 등록      |
| 상태 추적      | 어디에 무슨 설정이 있는지 불명확  | 모든 상태가 동일한 인스턴스에 집중 |
| 유지보수       | 실수 잦고 디버깅 어려움           | 코드를 덜 읽어도 일관성 보장       |

---

## 📌 결론

- IIFE는 **내부 상태를 외부로부터 완전히 은닉**하고, 안전한 모듈 구조를 제공합니다.
- Singleton은 **전역에서 하나의 인스턴스를 유지하여 상태 충돌을 원천 차단**합니다.
- 이 두 기술을 결합하면 MyExpress 엔진은 **실무에 바로 투입 가능한 안정적인 구조**로 진화할 수 있습니다.

---
