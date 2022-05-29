const mongoose = require("mongoose");
const todoTaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
  column: {
    type: mongoose.Schema.Types.ObjectId, ref:'Column'
  },
  priority: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("TodoTask", todoTaskSchema);
