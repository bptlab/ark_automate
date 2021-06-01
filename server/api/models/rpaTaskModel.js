const mongoose = require('mongoose');

const { Schema } = mongoose;

const rpaParameterSchema = new Schema({
  name: String,
  type: String,
  required: Boolean,
  infoText: String,
  index: Number,
});

const rpaTaskSchema = new Schema({
  application: { type: String, required: [true, 'Application required'] },
  task: { type: String, required: [true, 'Task required'] },
  code: { type: String, required: [true, 'Code required'] },
  outputValue: Boolean,
  inputVars: [rpaParameterSchema],
  output: rpaParameterSchema,
});

mongoose.model('rpa-task', rpaTaskSchema);
