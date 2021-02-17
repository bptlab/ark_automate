const mongoose = require('mongoose');

const {Schema} = mongoose;

const robotMetadataSchema = new Schema({
    robotId: String,
    starterId: String
});

const instructionSchema = new Schema({
    type: String,
    name: String,
    predecessorIds: [mongoose.Types.ObjectId],
    successorIds: [mongoose.Types.ObjectId],
    rpaApplication: String,
    rpaTask: String,
    rpaParameters: [inputParameterSchema],
    outputVariable: Schema.Types.Mixed
});

const inputParameterSchema = new Schema({
    name: String,
    value: Schema.Types.Mixed,
    requireUserInput: Boolean
});

const markerSchema = new Schema({
    type: String,
    name: String,
    predecessorIds: [mongoose.Types.ObjectId],
    successorIds: [mongoose.Types.ObjectId]
});

const SSoT_Schema = new Schema({
  robotMetadata: robotMetadataSchema,
  Task: String,
  Code: String
}, { collection: 'completeCollection' });

mongoose.model('SSoTs', SSoT_Schema);
