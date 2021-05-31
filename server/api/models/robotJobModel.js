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
  activityName: { type: String, required: [true, 'Activity name required'] },
  tasks: {
    type: [tasksStatusSchema],
    required: [true, 'At least on task required'],
  },
  message: { type: String, required: [true, 'Error messsage required'] },
});

const jobSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'UserId required'],
  },
  robotId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'RobotId required'],
  },
  status: { type: String, required: [true, 'Status required'] },
  parameters: [inputParameterSchema],
  loggedErrors: [activityErrorSchema],
});

const Job = mongoose.model('job', jobSchema);
module.exports = { Job };
