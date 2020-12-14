/**
 * @description Receives an array of bmpnTasks and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
function generateCodeForMultiple(bpmnTasks) {
  let lastApplication = 'None';
  let codeToAppend = "";
  for (let task in bpmnTasks) {
    let bpmnTaskProps;
    let currentTask = bpmnTasks[task]
    bpmnTaskProps = currentTask['_attributes']['arkRPA:inputVars'];
    console.log(bpmnTaskProps)
    for (let propsIndex in bpmnTaskProps) {

      let currentApplication = currentTask["_attributes"]['arkRPA:application'];
      if (currentApplication !== lastApplication) {
        codeToAppend += currentTask['_attributes']['name'] + '\n';
        lastApplication = currentApplication;

      }
        codeToAppend += '  ' + bpmnTaskProps[propsIndex]    
    }
    codeToAppend += '\n';
  }
  return codeToAppend
}

/**
 * @description Receives a single bmpnTask and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
function generateCodeForSingle(bpmnTask) {
  let codeToAppend = "";

  codeToAppend += bpmnTask['_attributes']['name'] + '\n';
  let bpmnTaskProps;
  bpmnTaskProps = bpmnTask['_attributes']['arkRPA:inputVars'];
  for (let propsIndex in bpmnTaskProps) {
    codeToAppend += '  ' + bpmnTaskProps[propsIndex];
  }
  return codeToAppend;
}

/**
 * @description Receives all bpmnTasks and creates a list of all distinct applications needed
 * @returns {array} List of applications as string
 */
function collectUsedApplications(bpmnTasks) {
  let applications = []
  for (let task in bpmnTasks) {
    if (bpmnTasks[task]["_attributes"] !== undefined) {
      const rpaApp =
        bpmnTasks[task]["_attributes"]['arkRPA:application'];
      if (!applications.includes(rpaApp)) {
        applications.push(rpaApp);
      }
    }
  }
  return applications
}

/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */
function parseDiagramJson(json_data) {
  let parsedCode = '';
  json_data = require("./newConvertedModelForTesting1Act.json")
  var bpmnTasks = json_data['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';

  if (bpmnTasks !== undefined) {
    let codeToAppend = '';
    if (Array.isArray(bpmnTasks)) {
      const applications = collectUsedApplications(bpmnTasks)

      for (let app in applications) {
        parsedCode += 'Library    ' + "RPA." + applications[app] + '\n';
      }

      // idealy we use the keyword statement for each task, currently not working out of the box
      parsedCode += '\n*** Tasks ***\n';
      codeToAppend += generateCodeForMultiple(bpmnTasks)
    } else {
      var application =
        bpmnTasks['_attributes']['arkRPA:application'];
      codeToAppend += 'Library    ' + "RPA." + application + '\n';

      codeToAppend += '\n*** Tasks ***\n';
      codeToAppend += generateCodeForSingle(bpmnTasks)
    }
    parsedCode += codeToAppend;
  }
  console.log(parsedCode)
  return parsedCode;
}
parseDiagramJson("");
module.exports = { parseDiagramJson };
