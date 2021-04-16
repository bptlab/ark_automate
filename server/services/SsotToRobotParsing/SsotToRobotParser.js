/**
 * @category Client
 * @module
 */
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const ssotModels = require('../../models/singleSourceOfTruthModel.js');
const jobsModel = require('../../models/robotJobModel.js');

const ACTIVITY_IDENTIFIER = 'INSTRUCTION';
const LINEBREAK = '\n';
const COMMENT = '#';
// eslint-disable-next-line no-unused-vars
const DOUBLESPACE = '  ';
const FOURSPACE = '    ';

/**
 * @description Checks whether the given element is of type instruction and contains rpa attributes
 * @param {Object} currentElement Element to check
 * @returns {Boolean} Value specifies if object is of type instruction and contains rpa attributes
 */
const isAnRpaInstruction = (currentElement) =>
  currentElement.type === ACTIVITY_IDENTIFIER;

/**
 * @description Checks whether the given element has a successor element
 * @param {Object} currentElement Element to check
 * @returns {Boolean} Value specifies if element has a successor element
 */
const successorTasksExist = (currentElement) =>
  currentElement.successorIds !== undefined &&
  currentElement.successorIds[0] !== '';

/**
 * @description Will append all provided parameters to a string which can be used to generate the RPAf file
 * @param {Object} parameterObject The parameter object to check and loop through
 * @returns {String} String specifying the input parameters with the needed spacing in between
 */
const appendRpaInputParameter = (parameterObject) => {
  let newCodeLine = '';

  const sortedInputs = parameterObject.rpaParameters.sort(
    (a, b) => a.index - b.index
  );
  sortedInputs.forEach((parameter) => {
    // regex will return -1 if no $$text$$ was found
    newCodeLine +=
      parameter.value.search(/\$\$(.*?)\$\$/) < 0
        ? `${FOURSPACE}${parameter.value}`
        : `${FOURSPACE}$\{${parameter.value.split('$$')[1]}\}`;
  });

  return newCodeLine;
};

/**
 * @description Will create a prefix to catch the output variable of an activity, if one is present
 * @param {Object} paramObject The parameter object to check and loop through
 * @returns {String} String specifying the output variables name
 */
const setOutputVar = (paramObject) => {
  let newCodeLine = FOURSPACE;

  if (paramObject.outputVariable) {
    newCodeLine += `\${${paramObject.outputVariable}} =${FOURSPACE}`;
  }

  return newCodeLine;
};

/**
 * @description Receives an array of all elements and generates the .robot code for the elements recursively.
 * @param {String} id Id of the element we are looking for
 * @param {Array} elements All the elements from the SSoT
 * @param {String} codeToAppend The current code we want to extend
 * @param {String} previousApplication Name of the rpa application of the previous element
 * @returns {string} Generated .robot code for the tasks section
 */
const writeCodeForElement = (
  id,
  elements,
  parameters,
  attributes,
  codeToAppend,
  previousApplication
) => {
  const currentElement = elements.find((element) => element.id === id);
  let combinedCode = codeToAppend;
  let newCodeLine = '';
  let newPreviousApplication = previousApplication;
  if (isAnRpaInstruction(currentElement)) {
    const currentAttributeObject = attributes.find(
      (attribute) => attribute.activityId === id
    );
    if (currentAttributeObject) {
      if (currentAttributeObject.rpaApplication !== previousApplication) {
        newPreviousApplication = currentAttributeObject.rpaApplication;
        newCodeLine += currentAttributeObject.rpaApplication + LINEBREAK;
      } else {
        newPreviousApplication = previousApplication;
      }
      newCodeLine += COMMENT + currentElement.name + LINEBREAK;
      const currentParameterObject = parameters.find(
        (parameter) => parameter.activityId === id
      );
      if (currentParameterObject) {
        newCodeLine += setOutputVar(currentParameterObject);
      }
      newCodeLine += currentAttributeObject.rpaTask;
      if (currentParameterObject) {
        newCodeLine += appendRpaInputParameter(currentParameterObject);
      }

      newCodeLine += LINEBREAK;
      combinedCode += newCodeLine;
    }
  }

  if (successorTasksExist(currentElement)) {
    // Xor handling is needed here in the future
    currentElement.successorIds.forEach((successorId) => {
      combinedCode = writeCodeForElement(
        successorId,
        elements,
        parameters,
        attributes,
        combinedCode,
        newPreviousApplication
      );
    });
  }
  return combinedCode;
};

/**
 * @description Receives an array of all elements and generates the .robot code for all RPA Tasks
 * @param {Array} elements All the elements from the SSoT
 * @param {Object} metaData MetaData of the robot
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForRpaTasks = (elements, parameters, attributes) => {
  const startElement = elements.find(
    (element) => element.predecessorIds.length === 0
  );

  const codeForRpaTasks = writeCodeForElement(
    startElement.id,
    elements,
    parameters,
    attributes,
    '',
    'None'
  );

  return codeForRpaTasks;
};

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
 * @param {String} parameterObjects The selection of parameter objects this function will have a look at
 * @param {String} newParameters New parameters in the form {id, value} that the function will use to update the parameter objects
 */
const updateParameterObjects = (parameterObjects, newParameters) => {
  Array.prototype.map.call(parameterObjects, (parameterObject) => {
    if (parameterObject.rpaParameters.length !== 0) {
      Array.prototype.map.call(
        parameterObject.rpaParameters,
        (currentParameter) => {
          Array.prototype.forEach.call(newParameters, (newParameter) => {
            if (
              // eslint-disable-next-line no-underscore-dangle
              String(newParameter.parameterId) === String(currentParameter._id)
            ) {
              // eslint-disable-next-line no-param-reassign
              currentParameter.value = newParameter.value;
            }
          });
          return currentParameter;
        }
      );
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
 * @param {Object} ssot The SSoT
 * @returns {string} Basic code for the .robot file
 */
const generateCodeBase = async (ssot) => {
  let parsedCode = '';
  parsedCode += `*** Settings ***${LINEBREAK}`;
  const attributeObjects = await retrieveAttributes(ssot);
  parsedCode += generateCodeForLibraryImports(attributeObjects);
  // ideally we use the keyword statement for each task, currently not working out of the box
  parsedCode += `${LINEBREAK}*** Tasks ***${LINEBREAK}`;
  return { parsedCode, attributeObjects };
};

/**
 * @description Parses the given SSoT to an executable .robot file
 * @param {Object} ssot The SSoT
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotToRobotCode = async (ssot) => {
  // eslint-disable-next-line prefer-const
  const result = generateCodeBase(ssot);
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
