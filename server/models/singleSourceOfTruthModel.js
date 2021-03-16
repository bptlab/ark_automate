const mongoose = require('mongoose');

const { Schema } = mongoose;

const inputParameterSchema = new Schema({
  name: String,
  value: Schema.Types.Mixed,
  requireUserInput: Boolean,
  type: String,
  isRequired: Boolean,
  infoText: String
});

const instructionSchema = new Schema({
  type: String,
  name: String,
  predecessorIds: [mongoose.Types.ObjectId],
  successorIds: [mongoose.Types.ObjectId],
  rpaApplication: String,
  rpaTask: String,
  rpaParameters: [inputParameterSchema],
  outputVariable: Schema.Types.Mixed,
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

mongoose.model('SSoT', ssotSchema);
