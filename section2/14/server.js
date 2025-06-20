// server.js (사용 예시)
const express = require("./myExpress");
const app = express.createApplication();

app.set("view engine", "ejs");
app.set("views", "./views");

console.log(app.settings);
// 출력: { 'view engine': 'ejs', views: './views' }
