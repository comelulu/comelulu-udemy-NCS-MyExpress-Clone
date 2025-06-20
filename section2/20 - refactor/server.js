const path = require("path");
const express = require("./index");
const staticMiddleware = require("./middleware/staticMiddleware");

const app = express();

app.use(staticMiddleware(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to MyExpress Server</h1><p>Try accessing /index.html or /style.css</p>"
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
