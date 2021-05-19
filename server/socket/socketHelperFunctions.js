/* eslint-disable no-unused-vars */
require('express');
const mongoose = require('mongoose');
const ssotToRobotParser = require('../utils/ssotToRobotParsing/ssotToRobotParser.js');
const ssotModels = require('../api/models/singleSourceOfTruthModel.js');
const userAccessObject = require('../api/models/userAccessObjectModel.js');
const jobsModel = require('../api/models/robotJobModel.js');

mongoose.set('useFindAndModify', false);

/**
 * @description Fetches the ssot of a given robot from the database and parses the ssot to robot code
 * @param {String} robotId The id of the robot that the robot code will be fetched for
 * @param {String} jobId The id of the current job
 */
exports.getRobotCodeForJob = async (robotId, jobId) => {
  try {
    const robotCode = ssotToRobotParser.parseCodeForJob(robotId, jobId);
    return robotCode;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * @description Fetches the ssot of a given robot from the database and parses the ssot to robot code
 * @param {String} robotId The id of the robot that the robot code will be fetched for
 */
exports.getRobotCode = async (robotId) => {
  try {
    const robotCode = ssotToRobotParser.parseSsotById(robotId);
    return robotCode;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * @description Finds a specific robot job and retrieves the parameter array
 * @param {String} jobId The id of the robot for which all parameters will be retrieved
 */
exports.getRobotJobParameters = async (jobId) => {
  const robotJobParameters = await mongoose
    .model('job')
    .findById(jobId, {
      parameters: 1,
    })
    .exec();
  return robotJobParameters;
};

/**
 * @description Fetches the ssot from the database and parses the ssot to robot code
 * @param {String} robotId The id of the robot which will be parsed to robot code
 */
exports.getAllUserIds = async () => {
  try {
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
 * @param {String} userId The id of the user that wants to execute a robot
 * @param {String} robotId The id of the robot tha will be executed
 * @param {String} status The current status of the job (either waiting, executing, successful or failed)
 * @param {Array} parameters Different parameters the user defined before executing the robot
 */
exports.createJob = async (userId, robotId, status, parameters) => {
  const job = new jobsModel.Job({
    user_id: userId,
    robot_id: robotId,
    status,
    parameters,
  });
  try {
    const jobObj = await job.save();
    const { _id: objId } = jobObj;
    return objId;
  } catch (err) {
    if (err) {
      console.error(err);
      return undefined;
    }
  }
};

/**
 * @description Finds a specific job in the database and updates the status of the Job
 * @param {String} jobId The id of the job that will be updated
 * @param {String} status The current status of the job (either waiting, executing, success or failed)
 */
exports.updateRobotJobStatus = async (jobId, status) => {
  await jobsModel.Job.findByIdAndUpdate(jobId, { status }, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

/**
 * @description Updates the given Job when the run has failed with the list of failing activities
 * @param {String} jobId The id of the job that will be updated
 * @param {Array} errorLog The list of logs of the robots activites
 */
exports.updateRobotJobErrors = async (jobId, errorLog) => {
  const errors = errorLog.robot_run.activities
    .filter((activity) => activity.status === 'FAIL')
    .map((activity) => ({
      activity_name: activity.activity_name,
      tasks: activity.tasks,
      message: activity.message,
    }));
  await jobsModel.Job.findByIdAndUpdate(
    jobId,
    { loggedErrors: errors },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};

/**
 * @description Finds all jobs with status waiting in the database for a specific user
 * @param {String} userId The id of the user for which all waiting jobs will be retrieved
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
