const mongoose = require("mongoose");
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId, ref:'Group'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Resource", resourceSchema);
