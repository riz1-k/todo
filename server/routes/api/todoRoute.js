const express = require('express');
const { todo } = require('../../controllers/todoController');
const Todo = require('../../database/models/todoSchema');
const User = require('../../database/models/userSchema');
// eslint-disable-next-line new-cap
const Router = express.Router();
const auth = require('../../middleware/auth');

Router.get('/', auth, todo);

Router.post('/', auth, (req, res) => {
  const todo = req.body.todo;
  const newTodo = new Todo({ task: todo });

  newTodo.save((err, savedTodo) => {
    if (err) {
      return res.status(400).json({ msg: "Couldn't save the todo" });
    }
    User.findById(req.user.id)
      .select('todos')
      .exec((err, user) => {
        if (err) {
          return res.status(400).json({ msg: "Couldn't save the todo" });
        }
        user.todos.push(savedTodo);
        user.save();
        return res.status(200).json({ todo: savedTodo });
      });
  });
});

Router.put('/:id', auth, (req, res) => {
  const todo = req.body.todo;

  Todo.findByIdAndUpdate({ _id: req.params.id }, { task: todo }).exec(err => {
    return res.status(200).json({ msg: 'Todo Updated' });
  });
});
Router.delete('/:id', auth, (req, res) => {
  console.log('here');
  Todo.deleteOne({ _id: req.params.id }).exec(err => {
    if (err) {
      console.log(err);
      return res.status(403).json({ msg: 'Could not delete todo' });
    }
    User.findById(req.user.id)
      .select('todos')
      .exec((err1, user) => {
        if (err1) {
          console.log(err1);
          return res.status(403).json({ msg: 'Could not delete todo' });
        }
        const index = user.todos.findIndex(x => x == req.params.id);
        if (index >= 0) {
          user.todos.splice(index, 1);
        }
        user.save();
        return res.status(200).json({ msg: 'Todo deleted' });
      });
  });
});
module.exports = Router;
