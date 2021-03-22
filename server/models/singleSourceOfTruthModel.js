const mongoose = require('mongoose');

const { Schema } = mongoose;

const singleParameterSchema = new Schema({
  name: String,
  value: Schema.Types.Mixed,
  requireUserInput: Boolean,
  type: String,
  isRequired: Boolean,
  infoText: String,
  index: Number
});

const parameterObjectSchema = new Schema({
  ssotId: mongoose.Types.ObjectId,
  activityId: String,
  outputVariable: String,
  rpaParameters: [ singleParameterSchema ],
});

const instructionSchema = new Schema({
  type: String,
  name: String,
  predecessorIds: [String],
  successorIds: [String],
  rpaApplication: String,
  rpaTask: String,
  id: String
});

const markerSchema = new Schema({
  type: String,
  name: String,
  predecessorIds: [mongoose.Types.ObjectId],
  successorIds: [mongoose.Types.ObjectId],
});

const ssotSchema = new Schema({
  starterId: String,
  robotName: String,
  elements: [instructionSchema, markerSchema],
});

mongoose.model('parameter', parameterObjectSchema);
mongoose.model('SSoT', ssotSchema);
