const mongoose = require('mongoose');

const { Schema } = mongoose;

const rpaVariableSchema = new Schema({
  name: String,
  type: String,
  required: Boolean,
  infoText: String,
  index: Number,
});

const rpaTaskSchema = new Schema({
  Application: { type: String, required: [true, 'Application required'] },
  Task: { type: String, required: [true, 'Task required'] },
  Code: { type: String, required: [true, 'Code required'] },
  outputValue: Boolean,
  inputVars: [rpaVariableSchema],
  Output: rpaVariableSchema,
});

mongoose.model('rpa-task', rpaTaskSchema);
