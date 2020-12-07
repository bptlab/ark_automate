//const {taskLib} = require('./rpaTaskToLibDict.jsx')
const { json } = require('body-parser');
const { parse } = require('path');

/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */

function taskLib(app) {
  if (app == 'Excel') return 'RPA.Excel.Files';
  if (app == 'Browser') return 'RPA.Browser';
}

function parseCodeToRobot(rpaTask, rpaTaskProps) {
  let codeToAppend ="";

  if (rpaTask == 'Open Browser') {
    // url of website to visit
    codeToAppend +=
      '   Open Browser    ' + (rpaTaskProps[2]._attributes.value) + '\n';
      return codeToAppend;
  }
  if (rpaTask == 'Open Workbook') {
    // path to workbook
    codeToAppend +=
      '   Open Workbook   ' + rpaTaskProps[2]._attributes.value + '\n';
      return codeToAppend;
  }
  if (rpaTask == 'Set Worksheet Value') {
    codeToAppend +=
      '   Set Worksheet Value  ' +
      // row
      rpaTaskProps[2]._attributes.value +
      '  ' +
      // column
      rpaTaskProps[3]._attributes.value +
      '  ' +
      // value
      rpaTaskProps[4]._attributes.value +
      '\n';
    codeToAppend += '   Save Workbook\n';
    return codeToAppend;
  }
}

function parseDiagramJson(json_data) {
  let parsedCode = '';
  // use this for testing locally json_data = require("./convertedModelForTesting1Activity.json")
  var bpmnTasks = json_data['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];
  // create Settings statements
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';

  // collect apps being used

    const applications = [];
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

    // import libraries needed for apps
    for (let app in applications) {
      parsedCode += 'Library    ' + taskLib(applications[app]) + '\n';
    }

    // idealy we use the keyword statement for each task, currently not working out of the box
    parsedCode += '\n*** Tasks ***\n';

    // add code for each task
    let codeToAppend = '';

    // if multiple tasks exists, they are stored in an array
    if (Array.isArray(bpmnTasks)) {
      for (let task in bpmnTasks) {
        codeToAppend += bpmnTasks[task]['_attributes']['name'] + '\n';
        let rpaTask, rpaTaskProps;
        rpaTaskProps =
          bpmnTasks[task]['bpmn2:extensionElements']['camunda:properties'][
            'camunda:property'
          ];
        rpaTask = rpaTaskProps[1]._attributes.value;
        codeToAppend += parseCodeToRobot(rpaTask, rpaTaskProps)
      }
    } else {
      //if only one task is existent
      codeToAppend += bpmnTasks['_attributes']['name'] + '\n';    
      let rpaTask, rpaTaskProps;
        rpaTaskProps =
          bpmnTasks['bpmn2:extensionElements']['camunda:properties'][
            'camunda:property'
          ];
        rpaTask = rpaTaskProps[1]._attributes.value;
        codeToAppend += parseCodeToRobot(rpaTask, rpaTaskProps)   
      }
    parsedCode += codeToAppend;
  
  return parsedCode;
}

// use this for testing locally console.log(parseDiagramJson("Hello"))

module.exports = { parseDiagramJson };
