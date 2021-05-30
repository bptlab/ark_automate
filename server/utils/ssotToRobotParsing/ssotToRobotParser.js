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
 * @param {Object} ssot The SSoT
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotToRobotCode = async (ssot) => {
  const result = await generateCodeBase(ssot);
  const parameters = await retrieveParameters(ssot);
  result.parsedCode += await generateCodeForRpaTasks(
    ssot.elements,
    parameters,
    result.attributeObjects
  );
  return result.parsedCode;
};

/**
 * @description Parses the given SSoT and parameters of the robot job to an executable .robot file
 * @param {Object} ssot The Ssot
 * @param {Object} jobId The id of the job
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotAndJobToRobotCode = async (ssot, jobId) => {
  const result = await generateCodeBase(ssot);
  const parameters = await retrieveParametersFromSsotAndJob(ssot, jobId);
  result.parsedCode += await generateCodeForRpaTasks(
    ssot.elements,
    parameters,
    result.attributeObjects
  );
  return result.parsedCode;
};

/**
 * @description Parses the Ssot provided by its id to an executable .robot file
 * @param {String} robotId The id of the ssot which will be parsed
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotById = async (robotId) => {
  const ssot = await mongoose.model('SSoT').findById(robotId).exec();
  return parseSsotToRobotCode(ssot);
};

/**
 * @description Parses the Ssot provided by its id to an executable .robot file
 * @param {String} robotId The id of the ssot which will be parsed
 * @param {String} jobId The id of the current robotJob that will be executed
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
