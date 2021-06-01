/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/**
 * @category Server
 * @module
 */
const mongoose = require('mongoose');
const ssotModels = require('../../api/models/singleSourceOfTruthModel.js');
const jobsModel = require('../../api/models/robotJobModel.js');
const { generateCodeBase } = require('./generateCodeBase');
const {
  retrieveParameters,
  retrieveParametersFromSsotAndJob,
} = require('./retrieveParameters');
const { generateCodeForRpaTasks } = require('./generateCodeForRpaTasks');

/**
 * @description Parses the given SSoT to an executable .robot file
 * @param {Object} ssot Ssot of the robot
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotToRobotCode = async (ssot) => {
  const result = await generateCodeBase(ssot);
  const parameters = await retrieveParameters(ssot);
  result.parsedCode += await generateCodeForRpaTasks(
    ssot.elements,
    parameters,
    result.attributeObjects,
    'frontend'
  );
  return result.parsedCode;
};

/**
 * @description Parses the given ssot and parameters of the robot job to an executable .robot file
 * @param {Object} ssot Ssot of the robot
 * @param {Object} jobId Id of the job
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotAndJobToRobotCode = async (ssot, jobId) => {
  const result = await generateCodeBase(ssot);
  const parameters = await retrieveParametersFromSsotAndJob(ssot, jobId);
  result.parsedCode += await generateCodeForRpaTasks(
    ssot.elements,
    parameters,
    result.attributeObjects,
    'local client'
  );
  return result.parsedCode;
};

/**
 * @description Parses the ssot provided by its id to an executable .robot file
 * @param {String} robotId Id of the ssot which will be parsed
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotById = async (robotId) => {
  const ssot = await mongoose.model('SSoT').findById(robotId).exec();
  return parseSsotToRobotCode(ssot);
};

/**
 * @description Parses the ssot provided by its id to an executable .robot file
 * @param {String} robotId Id of the ssot which will be parsed
 * @param {String} jobId Id of the current robotJob that will be executed
 * @returns {string} Code that has to be put in .robot file
 */
const parseCodeForJob = async (robotId, jobId) => {
  const ssot = await mongoose.model('SSoT').findById(robotId).exec();
  return parseSsotAndJobToRobotCode(ssot, jobId);
};

module.exports = {
  parseSsotToRobotCode,
  parseSsotById,
  parseCodeForJob,
};
