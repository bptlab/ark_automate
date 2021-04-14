/**
 * @category Server
 * @module
 */
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const ssotModels = require('../../models/singleSourceOfTruthModel.js');

const robotCodeConstants = require('./robotCodeConstants');

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
    if (element.type === robotCodeConstants.ACTIVITY_IDENTIFIER) {
      listOfActivityIds.push(element.id);
    }
  });

  const parameterObjects = await mongoose
    .model('parameter')
    .find(
      {
        ssotId: id,
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
 * @description For all activities in the ssot this method will retrieve the associated parameter objects
 * @param {Object} ssot The ssot for which the parameters should be retrieved
 * @returns {Array} Array of attribute objects
 */
const retrieveAttributes = async (ssot) => {
  const { id } = ssot;
  const { elements } = ssot;
  const listOfActivityIds = [];

  elements.forEach((element) => {
    if (element.type === robotCodeConstants.ACTIVITY_IDENTIFIER) {
      listOfActivityIds.push(element.id);
    }
  });

  const attributeObjects = await mongoose
    .model('rpaAttributes')
    .find({
      ssotId: id,
      activityId: { $in: listOfActivityIds },
    })
    .exec();

  return attributeObjects;
};

/**
 * TODO
 */
const retrieveSsot = async (ssotId) =>
  mongoose.model('SSoT').findById(ssotId).exec();

module.exports = {
  retrieveParameters,
  retrieveAttributes,
  retrieveSsot,
};
