/**
 * @category Client
 * @module
 */

/* eslint-disable dot-notation */

/**
 * @description Receives an array of bmpnTasks and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForElements = (elements) => {
  let lastApplication = 'None';
  let codeToAppend = '';
  Object.values(elements).forEach((element) => {
    if (
      Object.keys(element.rpaAttributes).length !== 0 &&
      element.rpaAttributes !== undefined
    ) {
      const rpaTaskName = element.rpaAttributes.task;
      let rpaTaskParameters = element.rpaAttributes.parameters;
      let counter = 0;
      if (Object.keys(rpaTaskParameters).length === 0) {
        const currentApplication = element.rpaAttributes.application;
        if (currentApplication !== lastApplication) {
          codeToAppend += `${element.generalAttributes.name}\n`;
          lastApplication = currentApplication;
        }
        codeToAppend += `  ${rpaTaskName}`;
      } else {
        Object.values(rpaTaskParameters).forEach((parameter) => {
          const currentApplication = element.rpaAttributes.application;
          if (currentApplication !== lastApplication) {
            codeToAppend += `${element.generalAttributes.name}\n`;
            lastApplication = currentApplication;
          }
          if (counter === 0) {
            codeToAppend += `  ${rpaTaskName}`;
          }
          counter += 1;
          codeToAppend += `  ${parameter.value}`;
        });
      }
    }
    counter = 0;
    codeToAppend += '\n';
  });
  return codeToAppend;
};

/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */
const parseSsotToRobotCode = (ssot) => {
  let parsedCode = '';
  const elements = ssot.elements;
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
    codeToAppend += generateCodeForElements(elements);
    parsedCode += codeToAppend;
  }
  return parsedCode;
};

module.exports = {
  parseSsotToRobotCode,
};
