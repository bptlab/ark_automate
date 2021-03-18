const mongoose = require('mongoose');

const { Schema } = mongoose;

const inputParameterSchema = new Schema({
  name: String,
  value: Schema.Types.Mixed,
  requireUserInput: Boolean,
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
});

const markerSchema = new Schema({
  type: String,
  name: String,
  predecessorIds: [mongoose.Types.ObjectId],
  successorIds: [mongoose.Types.ObjectId],
});

// eslint-disable-next-line camelcase
const SSoT_Schema = new Schema({
  starterId: String,
  robotName: String,
  elements: [instructionSchema, markerSchema],
});

// const Ssot = mongoose.model('SSoT', SSoT_Schema);
module.exports = mongoose.model('SSoT', SSoT_Schema);
