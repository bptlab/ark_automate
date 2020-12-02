const fs = require('fs')
const { parse } = require('path')

/**
 * @description Parses an JSON created from the .bpmn xml of the model to an executable .robot file
 * @returns {string} Code that has to be put in .robot file
 */

// this should be refactored to a dictionary
function taskLib (app) {
  if (app == 'Excel') return 'RPA.Excel.Files'
  if (app == 'Browser') return 'RPA.Browser'
}

function parseXML (json_data) {
  let parsedCode = ''
  const bpmnTasks = json_data['bpmn2:definitions']['bpmn2:process']['bpmn2:task']

  // create Settings statements
  parsedCode += '*** Settings ***\n'
  parsedCode += 'Documentation  Our first parsed RPA\n'

  // collect apps being used
  const applications = []
  for (task in bpmnTasks) {
    const rpaApp =
      bpmnTasks[task]['bpmn2:extensionElements']['camunda:properties']['camunda:property'][0]._attributes.value
    if (!applications.includes(rpaApp)) {
      applications.push(rpaApp)
    }
  }

  // import libraries needed for apps
  for (app in applications) {
    parsedCode += 'Library    ' + taskLib(applications[app]) + '\n'
  }

  // idealy we use the keyword statement for each task, currently not working out of the box
  parsedCode += '\n*** Tasks ***\n'

  // add code for each task

  let codeToAppend = ''
  for (task in bpmnTasks) {
    codeToAppend += bpmnTasks[task]._attributes.name + '\n'
    let rpaTask, rpaTaskProps
    rpaTaskProps = bpmnTasks[task]['bpmn2:extensionElements']['camunda:properties']['camunda:property']
    const rpaTask = rpaTaskProps[1]._attributes.value

    // this should be refactored to a dictonary
    if (rpaTask == 'Open Browser')
    // url of website to visit
    { codeToAppend += '   Open Browser    ' + rpaTaskProps[2]._attributes.value + '\n' }
    if (rpaTask == 'Open Workbook')
    // path to workbook
    { codeToAppend += '   Open Workbook   ' + rpaTaskProps[2]._attributes.value + '\n' }
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
        '\n'
      codeToAppend += '   Save Workbook\n'
    }
  }

  parsedCode += codeToAppend

  fs.writeFile('./JSrobot.robot', parsedCode, () => {})
  console.log(parsedCode)
}

module.exports = { parseXML }
