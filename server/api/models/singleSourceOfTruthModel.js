const mongoose = require('mongoose');

const { Schema } = mongoose;

const singleParameterSchema = new Schema({
  name: String,
  value: String,
  requireUserInput: Boolean,
  type: String,
  isRequired: Boolean,
  infoText: String,
  index: Number,
});

const parameterObjectSchema = new Schema({
  robotId: mongoose.Types.ObjectId,
  activityId: String,
  outputValue: String,
  rpaParameters: [singleParameterSchema],
});

const instructionSchema = new Schema({
  type: String,
  name: String,
  predecessorIds: [String],
  successorIds: [String],
  id: String,
});

const rpaAttributesObjectSchema = new Schema({
  robotId: mongoose.Types.ObjectId,
  activityId: String,
  rpaApplication: String,
  rpaTask: String,
});

const markerSchema = new Schema({
  type: String,
  name: String,
  predecessorIds: [mongoose.Types.ObjectId],
  successorIds: [mongoose.Types.ObjectId],
});

const ssotSchema = new Schema({
  starterId: String,
  robotName: { type: String, required: [true, 'robotName required'] },
  elements: { type: [instructionSchema, markerSchema] },
});

mongoose.model('parameter', parameterObjectSchema);
mongoose.model('rpaAttributes', rpaAttributesObjectSchema);
mongoose.model('SSoT', ssotSchema);
