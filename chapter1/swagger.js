const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

let todos = []; // Todo 데이터를 저장할 배열
let todoIdCursor = 1; // Todo 데이터의 ID를 생성하기 위한 변수

app.use(express.json()); // JSON 요청을 받기 위한 설정

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "A simple Todo API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./swagger.js"], // Swagger 주석이 포함된 파일
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Todo List 조회하기
 *     responses:
 *       200:
 *         description: Todo 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 */
app.get("/todos", (req, res) => {
  res.json(todos);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Todo 추가하기
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: 생성된 Todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 */
app.post("/todos", (req, res) => {
  const { title } = req.body;
  const newTodo = { id: todoIdCursor++, title };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: 특정 Todo 수정하기
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정된 Todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *       404:
 *         description: Todo가 없을 때
 */
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

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: 특정 Todo 삭제하기
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => todo.id !== Number(id));
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Swagger docs are available at http://localhost:${PORT}/api-docs`
  );
});
