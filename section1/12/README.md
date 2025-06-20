💡 **테스트 방법 요약**

1. `index.js` 서버 파일을 실행하세요.

   ```bash
   node index.js
   ```

2. 브라우저에서 `form.html` 파일을 열고 폼을 제출합니다.

3. 콘솔에는 다음 로그가 출력되고:

   ```
   📦 [Form Data]: { username: 'Alice', age: '30' }
   ```

4. 브라우저에는 다음과 같은 JSON 응답이 출력됩니다:

   ```json
   {
     "status": "Registration Complete",
     "received": {
       "username": "Alice",
       "age": "30"
     }
   }
   ```

이 최종 코드는 URL-Encoded 폼 데이터를 안전하게 수신하고 파싱하여 req.body에 담아 다음 미들웨어에서 사용할 수 있게 처리하며, JSON으로 클라이언트에 응답을 돌려주는 완전한 폼 처리 서버 구조를 보여줍니다. 이후 강의에서는 `express.Router()` 스타일의 모듈 분리 구조를 구현하면서 코드를 더욱 확장해 나가게 됩니다.
