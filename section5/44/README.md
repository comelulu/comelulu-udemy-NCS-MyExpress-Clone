# 📘 MyExpress 구조 개선: Singleton 패턴과 IIFE를 통한 아키텍처 안정화

---

## ✅ 기존 구조의 아키텍처적 문제

MyExpress 엔진 초기 구조는 다음과 같은 형태로 설계되어 있었습니다:

```js
function createApplication() {
  return new Application();
}

const app1 = createApplication();
const app2 = createApplication();
```

이 구조는 **각 호출마다 독립적인 Application 인스턴스를 생성**하게 되며, 다음과 같은 아키텍처적 문제를 야기합니다:

- **인스턴스 불일치**
  설정 값, 미들웨어 등록, 전역 상태 등이 여러 객체에 분산되어 일관성이 깨짐

- **컨트롤 타워의 부재**
  서버 전체를 대표하는 하나의 중심 객체가 아닌, 서로 다른 컨트롤러가 생겨 의도하지 않은 동작을 유발

- **현실 비유**
  마치 학교에서 **출석부를 여러 개 만들어 서로 다른 기록을 남기는 상황**입니다.
  학생 A는 첫 번째 출석부에, 학생 B는 두 번째 출석부에 기록된다면,
  결국 실제 출결 정보가 엉키고 신뢰할 수 없는 시스템이 됩니다.

---

## 🎯 개선 목표: 아키텍처의 단일성 및 보안 강화

### 1. **싱글 인스턴스 제어 (Singleton Pattern)**

- 서버는 **하나의 중심 Application 인스턴스**를 기준으로 동작해야 함
- 등록된 미들웨어, 설정 값, 라우팅 정보가 **중앙에서 관리되는 구조**를 확보해야 함

### 2. **내부 상태 은닉 (Encapsulation via IIFE + Closure)**

- 중요한 내부 상태(예: `instance`)는 **외부에서 접근하거나 수정할 수 없어야 함**
- 자바스크립트의 클로저와 즉시 실행 함수(IIFE)를 활용하여 **캡슐화** 구조를 구성

---

## 🛠️ 구조 개선: Singleton + IIFE의 통합 구현

```js
const MyExpress = (function () {
  let instance;

  function createApplication() {
    // 내부에서 실제 Application 인스턴스를 생성하는 로직
    return new Application(); // 예시
  }

  return function () {
    if (!instance) {
      instance = createApplication(); // 최초 1회만 생성
    }
    return instance;
  };
})();
```

---

## 📊 아키텍처 관점에서의 구조 설명

| 구성 요소                    | 역할 및 설명                                           |
| ---------------------------- | ------------------------------------------------------ |
| `let instance;`              | **전역 상태를 내부 클로저로 은닉**하여 외부 접근 차단  |
| `createApplication()`        | 실제 Application 객체를 생성하는 내부 Factory Function |
| `return function () { ... }` | 호출 시 인스턴스를 반환하는 싱글톤 인터페이스          |
| `if (!instance)`             | 인스턴스가 없는 경우에만 생성하여 **중복 생성을 방지** |

이 구조는 Express.js의 내부 구조에서 실제로 사용하는 전형적인 **상태 은닉 + 제어 인터페이스 제공 방식**과 유사합니다.

---

## ✅ 결과적으로 얻는 아키텍처 이점

```js
const app1 = MyExpress();
const app2 = MyExpress();

console.log(app1 === app2); // ✅ true
```

- 어떤 시점에서 MyExpress를 호출하더라도 **항상 동일한 인스턴스를 반환**
- 미들웨어, 라우트, 설정 등이 **동일한 전역 컨텍스트에 저장되고 공유됨**

---

## 🧠 클로저와 은닉 구조의 동작 원리

```js
const getSecret = (function () {
  let secret = 42;
  return function () {
    return secret;
  };
})();

console.log(getSecret()); // 42
console.log(getSecret.secret); // undefined
```

- `secret` 변수는 **클로저 안에 캡슐화되어 외부에서 접근 불가**
- 내부 함수만 해당 값에 접근 가능 → 안전한 은닉 구조 구성

> `MyExpress` 구조 또한 동일한 은닉 원리를 기반으로 하여 인스턴스를 안전하게 보호합니다.

---

## 🎓 실무적 비유로 다시 정리

> **MyExpress 인스턴스는 학교의 출석부입니다.**
> 출석부는 무조건 하나여야 합니다. 모든 반이 그 하나를 공유해서 사용해야
> 출결 데이터가 정확하게 저장되고, 교사 간 혼선 없이 사용할 수 있습니다.
> MyExpress 인스턴스도 마찬가지로 **모든 라우터, 미들웨어, 설정 로직의 중심이 되어야 합니다.**

---

## 📌 아키텍처 차원에서의 효과 요약

| 항목                           | 효과                                                    |
| ------------------------------ | ------------------------------------------------------- |
| 🎯 단일 인스턴스 보장          | 서버 설정의 일관성 확보                                 |
| 🔒 상태 캡슐화                 | 인스턴스 및 내부 상태의 외부 수정 불가                  |
| 🧩 의도된 호출 인터페이스 유지 | 외부에서는 MyExpress() 호출만으로 접근 가능             |
| 🧱 구조적 보안 강화            | 중요한 설정 객체, 루트 경로 등의 노출 방지              |
| 🔁 재사용 가능성 향상          | 동일한 구조를 기반으로 여러 모듈에서 안전하게 사용 가능 |

---

## 📦 전체 아키텍처 흐름 요약

```mermaid
  A[외부 모듈] -->|MyExpress() 호출| B[IIFE 실행]
  B --> C{instance 존재?}
  C -- 아니오 --> D[createApplication() 실행]
  C -- 예 --> E[기존 instance 반환]
  D --> E
  E --> F[항상 동일한 Application 인스턴스 반환]
```

---
