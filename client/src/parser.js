/**
 * @description Receives an array of bmpnTasks and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
function generateCodeForMultiple(bpmnTasks) {
  let lastApplication = 'None';
  let codeToAppend = "";
  for (let task in bpmnTasks) {
    let bpmnTaskProps;
    bpmnTaskProps =
      bpmnTasks[task]['bpmn2:extensionElements']['camunda:properties'][
      'camunda:property'
      ];
    for (let propsIndex in bpmnTaskProps) {
      if (propsIndex == 0) {
        let currentApplication = bpmnTaskProps[0]._attributes.value
        if (currentApplication !== lastApplication) {
          codeToAppend += bpmnTasks[task]['_attributes']['name'] + '\n';
          lastApplication = bpmnTaskProps[propsIndex]._attributes.value;
        }
      } else if (propsIndex > 0) {
        codeToAppend += '  ' + bpmnTaskProps[propsIndex]._attributes.value;
      }
    }
    codeToAppend += '\n';
  }
  return codeToAppend
}

/**
 * @description Receives a single bmpnTask and generates the .robot code for the tasks sections
 * @returns {string} Generated .robot code for the tasks section
 */
function generateCodeForSingle(bpmnTasks) {
  let codeToAppend = "";
  let taskExtensions = bpmnTasks['bpmn2:extensionElements'];

  let bpmnTask = bpmnTasks;
  codeToAppend += bpmnTask['_attributes']['name'] + '\n';
  let bpmnTaskProps;
  bpmnTaskProps = taskExtensions['camunda:properties']['camunda:property'];
  for (let propsIndex in bpmnTaskProps) {
    if (propsIndex > 0) {
      codeToAppend += '  ' + bpmnTaskProps[propsIndex]._attributes.value;
    }
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
    if (bpmnTasks[task]['bpmn2:extensionElements'] !== undefined) {
      const rpaApp =
        bpmnTasks[task]['bpmn2:extensionElements']['camunda:properties'][
          'camunda:property'
        ][0]._attributes.value;
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
  json_data = require("./parser/convertedModelForTesting1Activity.json")
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
      let taskExtensions = bpmnTasks['bpmn2:extensionElements'];

      var application =
        taskExtensions['camunda:properties']['camunda:property'][0]._attributes
          .value;
      codeToAppend += 'Library    ' + "RPA." + application + '\n';

      codeToAppend += '\n*** Tasks ***\n';
      codeToAppend += generateCodeForSingle(bpmnTasks)
    }
    parsedCode += codeToAppend;
  }
  return parsedCode;
}

module.exports = { parseDiagramJson };
