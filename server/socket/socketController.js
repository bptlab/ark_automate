/* eslint-disable no-unused-vars */
require('express');
const mongoose = require('mongoose');
const ssotToRobotParser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');
const ssotModels = require('../models/singleSourceOfTruthModel.js');
const jobsModel = require('../models/robotJobModel.js');

mongoose.set('useFindAndModify', false);

/**
 * @description Fetches the ssot from the database and parses the ssot to robot code
 * @param {Integer} robotId the id of the robot we want the robot code for
 */
exports.getRobotCode = async (robotId) => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const ssot = await mongoose.model('SSoT').findById(robotId).exec();
    const robotCode = ssotToRobotParser.parseSsotToRobotCode(ssot);
    return robotCode;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * @description Creates a Job in the database for a robot execution of a specific user
 * @param {Integer} userId the id of the user that wants to execute a robot
 * @param {Integer} robotId the id of the robot to be executed
 * @param {Integer} status the current status of the job (either waiting, executing or done)
 * @param {Integer} parameters different parameters the user defined before executing the robot
 */
exports.createJob = async (userId, robotId, status, parameters) => {
  const job = new jobsModel.Job({
    user_id: userId,
    robot_id: robotId,
    status,
    parameters,
  });
  try {
    const obj = await job.save();
    const { _id: objId } = obj;
    return objId;
  } catch (err) {
    if (err) {
      console.error(err);
    }
  }
};

exports.updateRobotJob = (jobId, status) => {
  jobsModel.Job.findByIdAndUpdate(jobId, { status }, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

exports.getAllJobsForUser = async (userId) => {
  const jobList = await jobsModel.Job.find(
    { user_id: userId, status: 'waiting' },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
  return jobList;
};
