const { parse } = require('path');

/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */

// this should be refactored to a dictionary
function taskLib(app) {
  if (app == 'Excel.Files') return 'RPA.Excel.Files';
  if (app == 'Browser') return 'RPA.Browser';
}

function parseDiagramJson(json_data) {
  let parsedCode = '';
  var bpmnTasks = json_data['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];

  // create Settings statements
  parsedCode += '*** Settings ***\n';
  parsedCode += 'Documentation  Our first parsed RPA\n';

  if (bpmnTasks !== undefined) {
    console.log('bpmnTasks: ' + bpmnTasks);
    let codeToAppend = '';
    if (typeof bpmnTasks[0] === 'object') {
      // collect apps being used
      const applications = [];
      for (let task in bpmnTasks) {
        const rpaApp =
          bpmnTasks[task]['bpmn2:extensionElements']['camunda:properties'][
            'camunda:property'
          ][0]._attributes.value;
        if (!applications.includes(rpaApp)) {
          applications.push(rpaApp);
        }
      }
      console.log(applications);

      // import libraries needed for apps
      for (let app in applications) {
        parsedCode += 'Library    ' + taskLib(applications[app]) + '\n';
      }

      // idealy we use the keyword statement for each task, currently not working out of the box
      parsedCode += '\n*** Tasks ***\n';

      // add code for each task
      let currentApplication = 'None';
      for (let task in bpmnTasks) {
        let bpmnTaskProps;
        bpmnTaskProps =
          bpmnTasks[task]['bpmn2:extensionElements']['camunda:properties'][
            'camunda:property'
          ];
        for (let i in bpmnTaskProps) {
          if (i == 0) {
            if (bpmnTaskProps[i]._attributes.value !== currentApplication) {
              codeToAppend += bpmnTasks[task]['_attributes']['name'] + '\n';
              currentApplication = bpmnTaskProps[i]._attributes.value;
            }
          } else if (i > 0) {
            codeToAppend += '  ' + bpmnTaskProps[i]._attributes.value;
          }
        }
        codeToAppend += '\n';
      }
    } else {
      // collect app being used

      let taskExtensions = bpmnTasks['bpmn2:extensionElements'];
      var application =
        taskExtensions['camunda:properties']['camunda:property'][0]._attributes
          .value;

      // import libraries needed for apps
      parsedCode += 'Library    ' + taskLib(application) + '\n';

      // idealy we use the keyword statement for each task, currently not working out of the box
      parsedCode += '\n*** Tasks ***\n';

      // add code for task

      let bpmnTask = bpmnTasks;
      codeToAppend += bpmnTask['_attributes']['name'] + '\n';
      let bpmnTaskProps;
      bpmnTaskProps = taskExtensions['camunda:properties']['camunda:property'];
      for (let i in bpmnTaskProps) {
        if (i > 0) {
          codeToAppend += '  ' + bpmnTaskProps[i]._attributes.value;
        }
      }
    }
    parsedCode += codeToAppend;
  }
  console.log(parsedCode);
  return parsedCode;
}

module.exports = { parseDiagramJson };
