/**
 * @category Client
 * @module
 */

/* eslint-disable dot-notation */

/**
 * @description Checks whether the given element is of type instruction and contains rpa attributes
 * @param {Object} currentElement Element to check
 * @returns {Boolean} Value specifies if object is of type instruction and contains rpa attributes
 */
const isAnRpaInstruction = (currentElement) => currentElement.rpaTask !== undefined &&
  currentElement.rpaApplication !== undefined

/**
 * @description Checks whether the given element contains rpa parameters
 * @param {Object} currentElement Element to check
 * @returns {bool} Value specifies if object contains rpa parameters
 */
const rpaParametersExist = (currentElement) =>
  currentElement.rpaParameters !== undefined &&
  currentElement.rpaParameters.length !== 0;

/**
 * @description Checks whether the given element has a successor element
 * @param {Object} currentElement Element to check
 * @returns {bool} Value specifies if element has a successor element
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
  codeToAppend,
  previousApplication
) => {
  const currentElement = elements.find((element) => element.id === id);
  let combinedCode = codeToAppend
  let newPreviousApplication = previousApplication
  if (isAnRpaInstruction(currentElement)) {
    if (currentElement.rpaApplication !== previousApplication) {
      combinedCode += `${currentElement.name}\n`;
      newPreviousApplication = currentElement.rpaApplication;
    }
    combinedCode += `  ${currentElement.rpaTask}`;
    if (rpaParametersExist(currentElement)) {
      currentElement.rpaParameters.forEach((parameter) => {
        combinedCode += `  ${parameter.value}`;
      });
    }
    combinedCode += '\n';
  }

  if (successorTasksExist(currentElement)) {
    // Xor handling is needed here in the future
    currentElement.successorIds.forEach((successorId) => {
      combinedCode = writeCodeForElement(
        successorId,
        elements,
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
const generateCodeForRpaTasks = (elements) => {
  const startElement = elements.find(
    (element) => element.predecessorIds.length === 0
  );
  const { id } = startElement;
  const codeToAppend = '';
  const previousApplication = 'None';

  const codeForRpaTasks = writeCodeForElement(
    id,
    elements,
    codeToAppend,
    previousApplication
  );

  return codeForRpaTasks;
};

/**
 * @description Collects the applications used by the bot
 * @param {Array} elements All the elements from the SSoT
 * @returns {Array} All unique Applications that occur in the ssot
 */
const collectApplications = (elements) => {
  if (elements !== undefined && elements.length > 0) {
    const applications = [];
    elements.forEach((element) => {
      if (element.rpaApplication !== undefined) {
        if (!applications.includes(element.rpaApplication)) {
          applications.push(element.rpaApplication);
        }
      }
    });

    return applications;
  }
};

/**
 * @description Generates the Library Import Code of the .robot file
 * @param {Array} elements All the elements from the SSoT
 * @returns {string} Library Import Code that has to be put in .robot file
 */
const generateCodeForLibraryImports = (elements) => {
  let libraryImports = '';
  const applications = collectApplications(elements);
  Object.values(applications).forEach((application) => {
    libraryImports += `${'Library    RPA.'}${application}\n`;
  });

  return libraryImports;
};

/**
 * @description Parses the SSoT to an executable .robot file
 * @param {Object} ssot The SSoT
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotToRobotCode = (ssot) => {
  const { elements } = ssot;
  let parsedCode = '';
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';
  parsedCode += generateCodeForLibraryImports(elements);
  // ideally we use the keyword statement for each task, currently not working out of the box
  parsedCode += '\n*** Tasks ***\n';
  parsedCode += generateCodeForRpaTasks(elements);

  return parsedCode;
};

module.exports = {
  parseSsotToRobotCode,
};
