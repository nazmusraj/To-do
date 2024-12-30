const fs = require('fs');
const filePath = './data/todos.json';

function readTodos() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

function writeTodos(todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

module.exports = (req, res) => {
  const todos = readTodos();

  if (req.method === 'GET') {
    res.status(200).json(todos);
  } else if (req.method === 'POST') {
    const newTodo = req.body;
    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
  } else if (req.method === 'PATCH') {
    const { text } = req.query;
    const updatedTodo = req.body;
    const index = todos.findIndex((todo) => todo.text === text);
    todos[index] = updatedTodo;
    writeTodos(todos);
    res.status(200).json(updatedTodo);
  } else if (req.method === 'DELETE') {
    const { text } = req.query;
    const filteredTodos = todos.filter((todo) => todo.text !== text);
    writeTodos(filteredTodos);
    res.status(204).end();
  }
};
