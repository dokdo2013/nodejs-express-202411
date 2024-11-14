const express = require("express");
const app = express();
const PORT = 3000;

let todos = []; // Todo 데이터를 저장할 배열
let todoIdCursor = 1; // Todo 데이터의 ID를 생성하기 위한 변수

app.use(express.json()); // JSON 요청을 받기 위한 설정

// Todo 목록 조회
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Todo 추가
app.post("/todos", (req, res) => {
  const { title } = req.body;
  const newTodo = { id: todoIdCursor, title };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Todo 수정
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const todo = todos.find((todo) => todo.id === Number(id));
  if (todo) {
    todo.title = title;
    res.json(todo);
  } else {
    res.status(404).end();
  }
});

// Todo 삭제
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => todo.id !== Number(id));
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
