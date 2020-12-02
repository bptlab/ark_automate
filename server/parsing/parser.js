const fs = require('fs');
const { parse } = require('path');

/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */

// this should be refactored to a dictionary
function taskLib(app) {
  if (app == 'Excel') return 'RPA.Excel.Files';
  if (app == 'Browser') return 'RPA.Browser';
}
//var json_data = require('./convertedModel.json');

function parseXML(json_data) {
  console.log(json_data);

  var parsedCode = '';

  var bpmnTasks = json_data['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];
  console.log(bpmnTasks['_attributes']['name']);

  // create Settings statements
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';

  // collect apps being used
  let applications = [];
  for (task in bpmnTasks) {
    let rpaApp =
      bpmnTasks[task].extensionElements.properties.property[0]._value;
    if (!applications.includes(rpaApp)) {
      applications.push(rpaApp);
    }
  }
  console.log(applications);

  // import libraries needed for apps
  for (app in applications) {
    parsedCode += 'Library    ' + taskLib(applications[app]) + '\n';
  }

  parsedCode += '\n*** Tasks ***\n';
  var codeToAppend = '';

  // add code for each task
  for (task in bpmnTasks) {
    // idealy we use the keyword statement for each task, currently not working out of the box

    codeToAppend += bpmnTasks[task]._name + '\n';
    let rpaTask, rpaTaskProps;
    rpaTaskProps = bpmnTasks[task].extensionElements.properties.property;
    rpaTask = rpaTaskProps[1]._value;

    // this should be refactored to a dictonary
    if (rpaTask == 'Open Browser')
      codeToAppend += '   Open Browser    ' + rpaTaskProps[2]['_value'] + '\n';
    if (rpaTask == 'Open Workbook')
      codeToAppend += '   Open Workbook   ' + rpaTaskProps[2]['_value'] + '\n';
    if (rpaTask == 'Set Worksheet Value') {
      codeToAppend +=
        '   Set Worksheet Value  ' +
        rpaTaskProps[2]['_value'] +
        '  ' +
        rpaTaskProps[3]['_value'] +
        '  ' +
        rpaTaskProps[4]['_value'] +
        '\n';
      codeToAppend += '   Save Workbook\n';
    }
  }

  parsedCode += codeToAppend;

  fs.writeFile('./JSrobot.robot', parsedCode, () => {});
  console.log(parsedCode);
}

module.exports = { parseXML };
/* var obj;
fs.readFile('./convertedModel.json', 'utf8', function (err, data) {
    obj = JSON.parse(data);
    var test = obj[1];
    console.log(test);
   });
 */
