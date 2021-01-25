import { fetchParametersForApplicationAndTask } from '../api/rpaFramework';

/**
 * @description Given the parameters this method will update the XML properties of the selected element
 * @param {String} application the selected application
 * @param {String} task the selected task
 * @param {Object} modeling the modeling component
 * @param {Object} element the element currently selected and whos properties are supposed to be updated
 */
const fetchTaskParametersAndUpdateRPAProperties = (
  application,
  task,
  modeling,
  element
) => {
  fetchParametersForApplicationAndTask(application, task)
    .then((response) => response.json())
    .then((data) => {
      updateXML(data, application, task, modeling, element);
    })
    .catch((error) => {
      console.error(error);
    });
};

/**
 * @description Updates the XML of the selected element of the modeler
 * @param {Object} data the Object retrieved from MongoDB containing objects for input and output vars
 * @param {String} application the selected application
 * @param {String} task the selected task
 * @param {Object} modeling the modeling component
 * @param {Object} element the element currently selected and whos properties are supposed to be updated
 */
const updateXML = (data, application, task, modeling, element) => {
  let propertiesObject = {
    'arkRPA:application': application,
    'arkRPA:task': task,
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
  modeling.updateProperties(element, propertiesObject);
};

/**
 * @description Sets variables for input or output variables in an object
 * @param {Object} IOobject input or output variable object retrieved from MongoDB
 * @returns {Object} object where the fields have been set with values of that specific type
 */
const populateIOObjectWithMockValues = (IOobject) => {
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
};

export default fetchTaskParametersAndUpdateRPAProperties;
