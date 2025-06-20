function runMiddlewares(middlewares, req, res, out) {
  let index = 0;

  function next(err) {
    if (err) {
      if (out) return out(err); // 에러 핸들러가 전달되었을 경우
      res.statusCode = 500;
      res.end("Internal Server Error");
      return;
    }

    if (index >= middlewares.length) {
      if (out) return out(); // 모든 미들웨어 실행 후 최종 콜백 호출
      return;
    }

    const middleware = middlewares[index++];
    try {
      if (middleware.length === 4) {
        // 에러 핸들러는 생략
        next();
      } else {
        middleware(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  }

  next(); // 첫 미들웨어 실행
}

module.exports = runMiddlewares;
