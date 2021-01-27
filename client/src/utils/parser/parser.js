/**
 * @category Client
 * @module
 */

/* eslint-disable dot-notation */

/**
 * @description Receives an array of bmpnTasks and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForMultiple = (bpmnTasks) => {
  let lastApplication = 'None';
  let codeToAppend = '';
  Object.values(bpmnTasks).forEach((value) => {
    const currentTask = value;
    const rpaTaskName = currentTask['_attributes']['arkRPA:task'];
    const rpaTaskInputString = currentTask['_attributes']['arkRPA:inputVars'];
    let rpaTaskInput = rpaTaskInputString.replace(/[\/]/g, '');
    rpaTaskInput = JSON.parse(rpaTaskInput);
    let counter = 0;
    if (Object.keys(rpaTaskInput).length == 0) {
      const currentApplication =
        currentTask['_attributes']['arkRPA:application'];
      if (currentApplication !== lastApplication) {
        codeToAppend += `${currentTask['_attributes']['name']}\n`;
        lastApplication = currentApplication;
      }
      codeToAppend += `  ${rpaTaskName}`;
    } else {
      Object.values(rpaTaskInput).forEach((val) => {
        const currentApplication =
          currentTask['_attributes']['arkRPA:application'];
        if (currentApplication !== lastApplication) {
          codeToAppend += `${currentTask['_attributes']['name']}\n`;
          lastApplication = currentApplication;
        }
        if (counter === 0) {
          codeToAppend += `  ${rpaTaskName}`;
        }
        counter += 1;
        codeToAppend += `  ${val}`;
      });
    }
    counter = 0;
    codeToAppend += '\n';
  });
  return codeToAppend;
};

/**
 * @description Receives a single bmpnTask and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForSingle = (bpmnTask) => {
  let codeToAppend = '';

  codeToAppend += `${bpmnTask['_attributes']['name']}\n`;
  const rpaTaskName = bpmnTask['_attributes']['arkRPA:task'];
  const rpaTaskInputString = bpmnTask['_attributes']['arkRPA:inputVars'];
  let rpaTaskInput = rpaTaskInputString.replaceAll('/', '');
  rpaTaskInput = JSON.parse(rpaTaskInput);
  let counter = 0;
  if (Object.keys(rpaTaskInput).length === 0) {
    codeToAppend += `  ${rpaTaskName}`;
  } else {
    Object.values(rpaTaskInput).forEach((value) => {
      if (counter === 0) {
        codeToAppend += `  ${rpaTaskName}`;
      }
      counter += 1;
      codeToAppend += `  ${value}`;
    });
  }
  counter = 0;
  return codeToAppend;
};

/**
 * @description Receives all bpmnTasks and creates a list of all distinct applications needed
 * @returns {array} List of applications as string
 */
const collectUsedApplications = (bpmnTasks) => {
  const applications = [];
  Object.values(bpmnTasks).forEach((value) => {
    if (value['_attributes'] !== undefined) {
      const rpaApp = value['_attributes']['arkRPA:application'];
      if (!applications.includes(rpaApp)) {
        applications.push(rpaApp);
      }
    }
  });
  return applications;
};

/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */
const parseDiagramJson = (jsonData) => {
  let parsedCode = '';
  // json_data = require("./newConvertedModelForTesting1Act.json")
  const bpmnTasks =
    jsonData['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';
  if (bpmnTasks !== undefined) {
    let codeToAppend = '';
    if (Array.isArray(bpmnTasks)) {
      const applications = collectUsedApplications(bpmnTasks);
      Object.values(applications).forEach((value) => {
        parsedCode += `${'Library    RPA.'}${value}\n`;
      });

      // idealy we use the keyword statement for each task, currently not working out of the box
      parsedCode += '\n*** Tasks ***\n';
      codeToAppend += generateCodeForMultiple(bpmnTasks);
    } else {
      const application = bpmnTasks['_attributes']['arkRPA:application'];
      codeToAppend += `${'Library    RPA.'}${application}\n`;

      codeToAppend += '\n*** Tasks ***\n';
      codeToAppend += generateCodeForSingle(bpmnTasks);
    }
    parsedCode += codeToAppend;
  }
  return parsedCode;
};

export default parseDiagramJson;
