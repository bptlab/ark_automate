/**
 * @category Server
 * @module
 */
const {
  ACTIVITY_IDENTIFIER,
  FOURSPACE,
  LINEBREAK,
  COMMENT,
} = require('./robotCodeConstants');

/**
 * @description Checks whether the given element is of type instruction and contains rpa attributes
 * @param {Object} currentElement Element to check
 * @returns {Boolean} Value specifies if object is of type instruction and contains rpa attributes
 */
const isAnRpaInstruction = (currentElement) =>
  currentElement.type === ACTIVITY_IDENTIFIER;

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
        : `${FOURSPACE}$\{${parameter.value.split('$$')[1]}}`;
  });

  return newCodeLine;
};

/**
 * @description Checks whether the given element has a successor element
 * @param {Object} currentElement Element to check
 * @returns {Boolean} Value specifies if element has a successor element
 */
const successorTasksExist = (currentElement) =>
  currentElement.successorIds !== undefined &&
  currentElement.successorIds[0] !== '';

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

module.exports = {
  generateCodeForRpaTasks,
};
