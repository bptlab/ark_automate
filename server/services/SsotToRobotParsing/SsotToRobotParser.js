/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/**
 * @category Client
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
  // eslint-disable-next-line prefer-const
  const result = await generateCodeBase(ssot);
  const parameters = await retrieveParameters(ssot);
  result.parsedCode += generateCodeForRpaTasks(
    ssot.elements,
    parameters,
    result.attributeObjects
  );
  return result.parsedCode;
};

/**
 * @description Parses the given SSoT and parameters of the robot job to an executable .robot file
 * @param {Object} ssot The SSoT
 * @param {Object} jobId The id of the job
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotAndJobToRobotCode = async (ssot, jobId) => {
  // eslint-disable-next-line prefer-const
  const result = await generateCodeBase(ssot);
  const parameters = await retrieveParametersFromSsotAndJob(ssot, jobId);
  result.parsedCode += generateCodeForRpaTasks(
    ssot.elements,
    parameters,
    result.attributeObjects
  );
  return result.parsedCode;
};

/**
 * @description Parses the SSoT provided by its id to an executable .robot file
 * @param {String} robotId The id of the ssot which should be parsed
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotById = async (robotId) => {
  const ssot = await mongoose.model('SSoT').findById(robotId).exec();
  return parseSsotToRobotCode(ssot);
};

/**
 * @description Parses the SSoT provided by its id to an executable .robot file
 * @param {String} robotId The id of the ssot which should be parsed
 *  @param {String} jobId The id of the current robotJob that is to be executed
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
