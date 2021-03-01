/**
 * @category Client
 * @module
 */

/* eslint-disable dot-notation */

/**
 * @description Receives an array of all elements and generates the .robot code for the elements
 * @param {Array} elements all the elements from the SSoT
 * @param {String} id id of the element we are looking for
 * @param {String} codeToAppend the current code we want to extend
 * @param {String} lastApplication name of the rpa application of the previous element
 * @returns {string} Generated .robot code for the tasks section
 */
const writeCodeForElement = (id, elements, codeToAppend, lastApplication) => {
  const currentElement = elements.find(
    (element) => element.id === id
  );
  if (
    currentElement.rpaParameters !== undefined &&
    currentElement.rpaParameters.length !== 0
  ) {
    const rpaTaskName = currentElement.rpaTask;
    const rpaTaskParameters = currentElement.rpaParameters;
    let counter = 0;
    if (rpaTaskParameters.length === 0) {
      const currentApplication = currentElement.rpaApplication;
      if (currentApplication !== lastApplication) {
        codeToAppend += `${currentElement.name}\n`;
        lastApplication = currentApplication;
      }
      codeToAppend += `  ${rpaTaskName}`;
    } else {
      currentElement.rpaParameters.forEach((parameter) => {
        const currentApplication = currentElement.rpaApplication;
        if (currentApplication !== lastApplication) {
          codeToAppend += `${currentElement.name}\n`;
          lastApplication = currentApplication;
        }
        if (counter === 0) {
          codeToAppend += `  ${rpaTaskName}`;
        }
        counter += 1;
        codeToAppend += `  ${parameter.value}`;
      });
    }
    counter = 0;
    codeToAppend += '\n';
  } else {
    let codeTest = codeToAppend;
    currentElement.successorIds.forEach((successorId) => {
      codeTest = writeCodeForElement(
        successorId,
        elements,
        codeTest,
        lastApplication
      );
    });
    return codeTest;
  }

  if (
    currentElement.successorIds[0] === '' ||
    currentElement.successorIds === undefined
  ) {
    return codeToAppend;
  }
  let codeTest = '';
  currentElement.successorIds.forEach((successorId) => {
    codeTest = writeCodeForElement(
      successorId,
      elements,
      codeToAppend,
      currentElement.rpaApplication
    );
  });
  return codeTest;

};

/**
 * @description Receives an array of all elements and generates the .robot code for the elements
 * @param {Array} elements all the elements from the SSoT
 * @param {Object} metaData metaData of the robot
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForElements = (elements) => {
  const codeToAppend = '';
  const lastApplication = 'None';
  const startElement = elements.find(element => (element.predecessorIds.length === 0))
  const givenId = startElement.id

  const codeForElements = writeCodeForElement(
    givenId,
    elements,
    codeToAppend,
    lastApplication
  );

  return codeForElements;
};

/**
 * @description Collects the applications used by the bot
 * @returns {string} Code that has to be put in .robot file
 */
const collectApplications = (elements) => {
  let parsedApplicationsCode = ''
  if (elements !== undefined && elements.length > 0) {
    const applications = [];

    elements.forEach((element) => {
      if (element.rpaApplication !== undefined) {
        if (!applications.includes(element.rpaApplication)) {
          applications.push(element.rpaApplication)
        }
      }
    })
    Object.values(applications).forEach((application) => {
      parsedApplicationsCode += `${'Library    RPA.'}${application}\n`;
    });

    return parsedApplicationsCode
  }
}

/**
 * @description Parses the SSoT to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotToRobotCode = (ssot) => {
  let parsedCode = '';
  const { elements } = ssot;
  const metaData = ssot.robotMetadata;
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';
  parsedCode += collectApplications(elements)
  // idealy we use the keyword statement for each task, currently not working out of the box
  parsedCode += '\n*** Tasks ***\n';

  parsedCode += generateCodeForElements(elements);

  return parsedCode;
};

module.exports = {
  parseSsotToRobotCode,
};
