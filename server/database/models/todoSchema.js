const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
  task: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Todo', todoSchema);
