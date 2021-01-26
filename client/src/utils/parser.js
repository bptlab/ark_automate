/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */
const parseDiagramJson = (json_data) => {
  let parsedCode = '';
  // json_data = require("./newConvertedModelForTesting1Act.json")
  var bpmnTasks = json_data['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';

  if (bpmnTasks !== undefined) {
    let codeToAppend = '';
    if (Array.isArray(bpmnTasks)) {
      const applications = collectUsedApplications(bpmnTasks);

      for (let app in applications) {
        parsedCode += 'Library    ' + 'RPA.' + applications[app] + '\n';
      }

      // idealy we use the keyword statement for each task, currently not working out of the box
      parsedCode += '\n*** Tasks ***\n';
      codeToAppend += generateCodeForMultiple(bpmnTasks);
    } else {
      var application = bpmnTasks['_attributes']['arkRPA:application'];
      codeToAppend += 'Library    ' + 'RPA.' + application + '\n';

      codeToAppend += '\n*** Tasks ***\n';
      codeToAppend += generateCodeForSingle(bpmnTasks);
    }
    parsedCode += codeToAppend;
  }
  return parsedCode;
};

/**
 * @description Receives an array of bmpnTasks and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForMultiple = (bpmnTasks) => {
  let lastApplication = 'None';
  let codeToAppend = '';
  for (let task in bpmnTasks) {
    let currentTask = bpmnTasks[task];
    let rpaTaskName = currentTask['_attributes']['arkRPA:task'];
    let rpaTaskInputString = currentTask['_attributes']['arkRPA:inputVars'];
    let rpaTaskInput = rpaTaskInputString.replaceAll('/', '');
    rpaTaskInput = JSON.parse(rpaTaskInput);
    let counter = 0;
    if (Object.keys(rpaTaskInput).length == 0) {
      let currentApplication = currentTask['_attributes']['arkRPA:application'];
      if (currentApplication !== lastApplication) {
        codeToAppend += currentTask['_attributes']['name'] + '\n';
        lastApplication = currentApplication;
      }
      codeToAppend += '  ' + rpaTaskName;
    } else {
      for (let propsIndex in rpaTaskInput) {
        let currentApplication =
          currentTask['_attributes']['arkRPA:application'];
        if (currentApplication !== lastApplication) {
          codeToAppend += currentTask['_attributes']['name'] + '\n';
          lastApplication = currentApplication;
        }
        if (counter === 0) {
          codeToAppend += '  ' + rpaTaskName;
        }
        counter++;
        codeToAppend += '  ' + rpaTaskInput[propsIndex];
      }
    }
    counter = 0;
    codeToAppend += '\n';
  }
  return codeToAppend;
};

/**
 * @description Receives a single bmpnTask and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
const generateCodeForSingle = (bpmnTask) => {
  let codeToAppend = '';

  codeToAppend += bpmnTask['_attributes']['name'] + '\n';
  let rpaTaskName = bpmnTask['_attributes']['arkRPA:task'];
  let rpaTaskInputString = bpmnTask['_attributes']['arkRPA:inputVars'];
  let rpaTaskInput = rpaTaskInputString.replaceAll('/', '');
  rpaTaskInput = JSON.parse(rpaTaskInput);
  let counter = 0;
  if (Object.keys(rpaTaskInput).length == 0) {
    codeToAppend += '  ' + rpaTaskName;
  } else {
    for (let propsIndex in rpaTaskInput) {
      if (counter === 0) {
        codeToAppend += '  ' + rpaTaskName;
      }
      counter++;
      codeToAppend += '  ' + rpaTaskInput[propsIndex];
    }
  }
  counter = 0;
  return codeToAppend;
};

/**
 * @description Receives all bpmnTasks and creates a list of all distinct applications needed
 * @returns {array} List of applications as string
 */
const collectUsedApplications = (bpmnTasks) => {
  let applications = [];
  for (let task in bpmnTasks) {
    if (bpmnTasks[task]['_attributes'] !== undefined) {
      const rpaApp = bpmnTasks[task]['_attributes']['arkRPA:application'];
      if (!applications.includes(rpaApp)) {
        applications.push(rpaApp);
      }
    }
  }
  return applications;
};

export default parseDiagramJson;
