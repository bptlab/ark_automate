/* eslint-disable no-unused-vars */
require('express');
const mongoose = require('mongoose');
const ssotToRobotParser = require('../services/SsotToRobotParsing/SsotToRobotParser.js');
const ssotModels = require('../models/singleSourceOfTruthModel.js');
const userAccessObject = require('../models/userAccessObjectModel.js');
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
 * @description Fetches the ssot from the database and parses the ssot to robot code
 * @param {Integer} robotId the id of the robot we want the robot code for
 */
exports.getAllUserIds = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const userObjs = await mongoose.model('userAccessObject').find();
    let userIds = [];
    if (userObjs.length > 0) {
      userIds = userObjs.map((obj) => String(obj.userId));
    }
    return userIds;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * @description Creates a Job in the database for a robot execution of a specific user
 * @param {Integer} userId the id of the user that wants to execute a robot
 * @param {Integer} robotId the id of the robot to be executed
 * @param {Integer} status the current status of the job (either waiting, executing, success or failed)
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

/**
 * @description Finds a specific job in the database and updates the status of the Job
 * @param {Integer} jobId the id of the job that we want to update
 * @param {Integer} status the current status of the job (either waiting, executing, success or failed)
 */
exports.updateRobotJobStatus = (jobId, status) => {
  jobsModel.Job.findByIdAndUpdate(jobId, { status }, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

/**
 * @description Finds all jobs with status waiting in the database for a specific user
 * @param {Integer} userId the id of the user we want all waiting jobs for
 */
exports.getAllWaitingJobsForUser = async (userId) => {
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
