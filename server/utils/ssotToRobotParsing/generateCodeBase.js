/**
 * @category Server
 * @module
 */
const mongoose = require('mongoose');
const {
  ACTIVITY_IDENTIFIER,
  FOURSPACE,
  LINEBREAK,
} = require('./robotCodeConstants');

// eslint-disable-next-line no-unused-vars
const ssotModels = require('../../api/models/singleSourceOfTruthModel.js');

/**
 * @description Collects the applications used by the robot
 * @param {Array} elements All the elements from the SSoT
 * @returns {Array} All unique Applications that occur in the ssot
 */
const collectApplications = (elements) => {
  const applications = [];
  if (elements !== undefined && elements.length > 0) {
    elements.forEach((element) => {
      if (
        element.rpaApplication !== undefined &&
        !applications.includes(element.rpaApplication)
      ) {
        applications.push(element.rpaApplication);
      }
    });
  }
  return applications;
};

/**
 * @description Generates the Library Import Code of the .robot file
 * @param {Array} elements All the elements from the SSoT
 * @returns {string} Library Import Code that has to be put in .robot file
 */
const generateCodeForLibraryImports = (elements) => {
  let libraryImports = '';
  const applications = collectApplications(elements);
  if (applications.length > 0) {
    Object.values(applications).forEach((application) => {
      libraryImports += `Library${FOURSPACE}RPA.${application}${LINEBREAK}`;
    });
  }

  return libraryImports;
};

/**
 * @description Retrieve the associated parameter objects for all activities in the ssot
 * @param {Object} ssot Ssot for which the parameters will be retrieved
 * @returns {Array} Array of attribute objects
 */
const retrieveAttributes = async (ssot) => {
  const { id } = ssot;
  const { elements } = ssot;
  const listOfActivityIds = [];

  elements.forEach((element) => {
    if (element.type === ACTIVITY_IDENTIFIER) {
      listOfActivityIds.push(element.id);
    }
  });

  const attributeObjects = await mongoose
    .model('rpaAttributes')
    .find({
      robotId: id,
      activityId: { $in: listOfActivityIds },
    })
    .exec();

  return attributeObjects;
};

/**
 * @description Generates that basic code that every robot has
 * @param {Object} ssot Ssot that will be handled
 * @returns {string} Basic code for the .robot file
 */
const generateCodeBase = async (ssot) => {
  let parsedCode = '';
  parsedCode += `*** Settings ***${LINEBREAK}`;
  const attributeObjects = await retrieveAttributes(ssot);
  parsedCode += generateCodeForLibraryImports(attributeObjects);
  parsedCode += `${LINEBREAK}*** Tasks ***${LINEBREAK}`;
  return { parsedCode, attributeObjects };
};

module.exports = {
  generateCodeBase,
};
