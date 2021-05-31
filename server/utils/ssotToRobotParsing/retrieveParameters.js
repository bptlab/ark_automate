/* eslint-disable no-unused-vars */
/**
 * @category Server
 * @module
 */
const mongoose = require('mongoose');
const { ACTIVITY_IDENTIFIER } = require('./robotCodeConstants');
const ssotModels = require('../../api/models/singleSourceOfTruthModel.js');
const jobsModel = require('../../api/models/robotJobModel.js');

/**
 * @description Will retrieve the associated parameter objects for all activities in the ssot 
 * @param {Object} ssot Ssot for which the parameters will be retrieved
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
        outputValue: 1,
      }
    )
    .exec();

  return parameterObjects;
};

/**
 * @description Updates Parameter Objects with new parameters
 * @param {Array} parameterObjects Selection of parameter objects that will possibly be updated
 * @param {Array} newParameters New parameters in the form {id, value} that will be used to update the parameter objects
 * @returns {Array} Array of updated parameter objects
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
 * @description Retrieves all parameters for a specific job
 * @param {String} jobId Id of the job
 * @returns {Array} Array of parameter objects
 */
const getAllParametersForJob = async (jobId) => {
  const jobParametersObject = await mongoose
    .model('job')
    .findById(jobId, { parameters: 1 });
  return jobParametersObject.parameters;
};

/**
 * @description Retrieves the associated parameter objects for all activities in the ssot
 * @param {Object} ssot Ssot for which the parameters will be retrieved
 * @param {String} jobId Job id identifiyng a job object from which the additional paramters will be fetched
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
