const mongoose = require('mongoose');

const { Schema } = mongoose;

const inputParameterSchema = new Schema({
  parameterId: mongoose.Types.ObjectId,
  value: Schema.Types.Mixed,
});

const tasksStatusSchema = new Schema({
  task_name: String,
  status: String,
});

const activityErrorSchema = new Schema({
  activity_name: { type: String, required: [true, 'Activity name required'] },
  tasks: {
    type: [tasksStatusSchema],
    required: [true, 'At least on task required'],
  },
  message: { type: String, required: [true, 'Error messsage required'] },
});

// eslint-disable-next-line camelcase
const Job_Schema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: [true, 'UserId required'],
  },
  robot_id: {
    type: mongoose.Types.ObjectId,
    required: [true, 'RobotId required'],
  },
  status: { type: String, required: [true, 'Status required'] },
  parameters: [inputParameterSchema],
  loggedErrors: [activityErrorSchema],
});

const Job = mongoose.model('job', Job_Schema);
module.exports = { Job };
