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
    (element) => element.generalAttributes.id === id
  );
  if (
    Object.keys(currentElement.rpaAttributes).length !== 0 &&
    currentElement.rpaAttributes !== undefined
  ) {
    const rpaTaskName = currentElement.rpaAttributes.task;
    let rpaTaskParameters = currentElement.rpaAttributes.parameters;
    let counter = 0;
    if (Object.keys(rpaTaskParameters).length === 0) {
      const currentApplication = currentElement.rpaAttributes.application;
      if (currentApplication !== lastApplication) {
        codeToAppend += `${currentElement.generalAttributes.name}\n`;
        lastApplication = currentApplication;
      }
      codeToAppend += `  ${rpaTaskName}`;
    } else {
      Object.values(rpaTaskParameters).forEach((parameter) => {
        const currentApplication = currentElement.rpaAttributes.application;
        if (currentApplication !== lastApplication) {
          codeToAppend += `${currentElement.generalAttributes.name}\n`;
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
    currentElement.generalAttributes.successorIds.forEach((successorId) => {
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
    currentElement.generalAttributes.successorIds[0] === '' ||
    currentElement.generalAttributes.successorIds === undefined
  ) {
    return codeToAppend;
  } else {
    let codeTest = '';
    currentElement.generalAttributes.successorIds.forEach((successorId) => {
      codeTest = writeCodeForElement(
        successorId,
        elements,
        codeToAppend,
        currentElement.rpaAttributes.application
      );
    });
    return codeTest;
  }
};

/**
 * @description Receives an array of all elements and generates the .robot code for the elements
 * @param {Array} elements all the elements from the SSoT
 * @param {Object} metaData metaData of the robot
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForElements = (elements, metaData) => {
  let codeToAppend = '';
  let lastApplication = 'None';
  let givenId = metaData.starterId;

  const codeForElements = writeCodeForElement(
    givenId,
    elements,
    codeToAppend,
    lastApplication
  );

  return codeForElements;
};

/**
 * @description Parses the SSoT to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotToRobotCode = (ssot) => {
  let parsedCode = '';
  const elements = ssot.elements;
  const metaData = ssot.robotMetadata;
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';
  if (elements !== undefined && elements.length > 0) {
    let codeToAppend = '';
    const applications = [];
    Object.values(elements).forEach((element) => {
      if (
        Object.keys(element.rpaAttributes).length !== 0 &&
        element.rpaAttributes !== undefined
      ) {
        applications.push(element.rpaAttributes.application);
      }
    });
    const uniqueApplications = applications.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    Object.values(uniqueApplications).forEach((application) => {
      parsedCode += `${'Library    RPA.'}${application}\n`;
    });

    // idealy we use the keyword statement for each task, currently not working out of the box
    parsedCode += '\n*** Tasks ***\n';
    codeToAppend += generateCodeForElements(elements, metaData);
    parsedCode += codeToAppend;
  }
  return parsedCode;
};

module.exports = {
  parseSsotToRobotCode,
};
