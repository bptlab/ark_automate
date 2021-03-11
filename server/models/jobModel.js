const mongoose = require('mongoose');

const { Schema } = mongoose;

const inputParameterSchema = new Schema({
  name: String,
  value: Schema.Types.Mixed,
});

// eslint-disable-next-line camelcase
const Job_Schema = new Schema({
  user_id: mongoose.Types.ObjectId,
  ssot_id: mongoose.Types.ObjectId,
  status: String,
  parameters: [inputParameterSchema],
});

const Job = mongoose.model('jobs', Job_Schema);
module.exports =  { Job }
