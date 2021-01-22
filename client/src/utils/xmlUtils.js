/**
 * @description Given the parameters this method will update the XML properties of the selected element
 * @param {String} selectedApplication the selected application
 * @param {String} selectedTask the selected task
 * @param {Object} passedModeling the modeling component
 * @param {Object} passedElement the element currently selected and whos properties are supposed to be updated
 */
async function fetchTaskParametersAndUpdateRPAProperties(
  applicationName,
  taskName,
  modeling,
  element
) {
  await fetchParametersForTask(applicationName, taskName, modeling, element);
}

/**
 * @description Fetches input and output vars for the application, task tuple and calls the method to update the XML
 * @param {String} selectedApplication the selected application
 * @param {String} selectedTask the selected task
 */
async function fetchParametersForTask(
  selectedApplication,
  selectedTask,
  selectedModeling,
  selectedElement
) {
  await fetch(
    'rpa-framework/commands/get-vars-for-task?application=' +
      selectedApplication.replaceAll(' ', '+') +
      '&task=' +
      selectedTask.replaceAll(' ', '+')
  )
    .then((response) => response.json())
    .then((data) => {
      updateXML(
        data,
        selectedApplication,
        selectedTask,
        selectedModeling,
        selectedElement
      );
    });
}

/**
 * @description Updates the XML of the selected element of the modeler
 * @param {Object} data the Object retrieved from MongoDB containing objects for input and output vars
 * @param {String} selectedApplication the selected application
 * @param {String} selectedTask the selected task
 */
function updateXML(
  data,
  selectedApplication,
  selectedTask,
  selectedModeling,
  selectedElement
) {
  let propertiesObject = {
    'arkRPA:application': selectedApplication,
    'arkRPA:task': selectedTask,
    'arkRPA:inputVars': '',
    'arkRPA:outputVars': '',
  };
  if (data.inputVars)
    propertiesObject['arkRPA:inputVars'] = populateIOObjectWithMockValues(
      data.inputVars
    );
  if (data.outputVars)
    propertiesObject['arkRPA:outputVars'] = populateIOObjectWithMockValues(
      data.outputVars
    );
  selectedModeling.updateProperties(selectedElement, propertiesObject);
}

/**
 * @description Sets variables for input or output variables in an object
 * @param {Object} IOobject input or output variable object retrieved from MongoDB
 * @returns {Object} object where the fields have been set with values of that specific type
 */
function populateIOObjectWithMockValues(IOobject) {
  if (!IOobject) return null;
  let returnObject = {};
  for (let prop in IOobject) {
    switch (IOobject[prop]) {
      case 'Boolean':
        returnObject[prop] = true;
        break;
      case 'String':
        returnObject[prop] = 'TestString';
        break;
      case 'Integer':
        returnObject[prop] = 69;
        break;
      default:
        console.log(
          'Not yet supported data type found for IO:',
          IOobject[prop]
        );
    }
  }
  return JSON.stringify(returnObject);
}

module.exports = {
  fetchTaskParametersAndUpdateRPAProperties,
};
