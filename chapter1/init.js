const express = require("express");
const app = express();

app.use(express.json()); // JSON 요청을 받기 위한 설정

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
