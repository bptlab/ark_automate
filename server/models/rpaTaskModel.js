const mongoose = require('mongoose');

const { Schema } = mongoose;

const rpaVariableSchema = new Schema({
  name: String,
  type: String,
  required: Boolean,
  infoText: String,
  index: Number
});

const rpaTaskSchema = new Schema({
  Application: String,
  Task: String,
  Code: String,
  outputValue: Boolean,
  inputVars: [rpaVariableSchema],
  Output: rpaVariableSchema
});

mongoose.model('rpa-task', rpaTaskSchema);
