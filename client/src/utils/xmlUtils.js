/**
 * @category Client
 * @module
 */
import { fetchParametersForApplicationAndTask } from '../api/applicationAndTaskSelection';

/**
 * @description Sets variables for input or output variables in an object
 * @param {Object} IOobject input or output variable object retrieved from MongoDB
 * @returns {Object} object where the fields have been set with values of that specific type
 */
const populateIOObjectWithMockValues = (IOobject) => {
  if (!IOobject) return null;
  const returnObject = {};
  Object.entries(IOobject).forEach(([key, value]) => {
    switch (value) {
      case 'Boolean':
        returnObject[key] = true;
        break;
      case 'String':
        returnObject[key] = 'TestString';
        break;
      case 'Integer':
        returnObject[key] = 69;
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('Not yet supported data type found for IO:', IOobject[key]);
    }
  });
  return JSON.stringify(returnObject);
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
  const propertiesObject = {
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

export default fetchTaskParametersAndUpdateRPAProperties;
