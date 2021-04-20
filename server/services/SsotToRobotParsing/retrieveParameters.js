/**
 * @category Server
 * @module
 */
const mongoose = require('mongoose');
const { ACTIVITY_IDENTIFIER } = require('./robotCodeConstants');
// eslint-disable-next-line no-unused-vars
const ssotModels = require('../../models/singleSourceOfTruthModel.js');
// eslint-disable-next-line no-unused-vars
const jobsModel = require('../../models/robotJobModel.js');

/**
 * @description For all activities in the ssot this method will retrieve the associated parameter objects
 * @param {Object} ssot The ssot for which the parameters should be retrieved
 * @returns {Array} Array of parameter objects
 */
const retrieveParameters = async (ssot) => {
  const { id } = ssot;
  const { elements } = ssot;
  const listOfActivityIds = [];

  elements.forEach((element) => {
    if (element.type === ACTIVITY_IDENTIFIER) {
      listOfActivityIds.push(element.id);
    }
  });

  const parameterObjects = await mongoose
    .model('parameter')
    .find(
      {
        robotId: id,
        activityId: { $in: listOfActivityIds },
      },
      {
        activityId: 1,
        rpaParameters: 1,
        outputVariable: 1,
      }
    )
    .exec();

  return parameterObjects;
};

/**
 * @description Update Parameter Objects with new parameters
 * @param {Array} parameterObjects The selection of parameter objects this function will have a look at
 * @param {Array} newParameters New parameters in the form {id, value} that the function will use to update the parameter objects
 */
const updateParameterObjects = (parameterObjects, newParameters) => {
  parameterObjects.map((parameterObject) => {
    if (parameterObject.rpaParameters.length !== 0) {
      parameterObject.rpaParameters.map((currentParameter) => {
        newParameters.forEach((newParameter) => {
          if (
            // eslint-disable-next-line no-underscore-dangle
            String(newParameter.parameterId) === String(currentParameter._id)
          ) {
            // eslint-disable-next-line no-param-reassign
            currentParameter.value = newParameter.value;
          }
        });
        return currentParameter;
      });
    }
    return parameterObject;
  });
  return parameterObjects;
};

/**
 * @description Retrieve all parameters for a specific job
 * @param {String} jobId The id of the job
 */
const getAllParametersForJob = async (jobId) => {
  const jobParametersObject = await mongoose
    .model('job')
    .findById(jobId, { parameters: 1 });
  const jobParameters = jobParametersObject.parameters;
  return jobParameters;
};

/**
 * @description For all activities in the ssot this method will retrieve the associated parameter objects
 * @param {Object} ssot The ssot for which the parameters should be retrieved
 * @returns {Array} Array of parameter objects
 */
const retrieveParametersFromSsotAndJob = async (ssot, jobId) => {
  const parameterObjects = await retrieveParameters(ssot);
  const newParameters = await getAllParametersForJob(jobId);
  const parameterObjectsUpdated = await updateParameterObjects(
    parameterObjects,
    newParameters
  );
  return parameterObjectsUpdated;
};

module.exports = {
  retrieveParameters,
  retrieveParametersFromSsotAndJob,
};
