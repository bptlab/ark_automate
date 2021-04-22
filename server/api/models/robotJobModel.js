const mongoose = require('mongoose');

const { Schema } = mongoose;

const inputParameterSchema = new Schema({
  name: String,
  value: Schema.Types.Mixed,
});

// eslint-disable-next-line camelcase
const Job_Schema = new Schema({
  user_id: {type: mongoose.Types.ObjectId,required: [true, 'UserId required']},
  robot_id: {type: mongoose.Types.ObjectId,required: [true, 'RobotId required']},
  status: {type: String,required: [true, 'Status required']},
  parameters: [inputParameterSchema],
});

const Job = mongoose.model('job', Job_Schema);
module.exports = { Job };
