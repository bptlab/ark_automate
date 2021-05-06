/**
 * @category Client
 * @module
 */
import { getParameterObject } from '../attributeAndParamUtils';

const PARAMETER_STORAGE_PATH = 'parameterLocalStorage';

/**
 * @description Will set the single parameter in local session storage
 * @param {String} activityId Id of the activity for which to change the value for
 * @param {Object} value The value object returned by the dropdown selection
 * @param {String} parameterName The value of the parameter input field
 */
const setSingleParameter = (activityId, value, parameterName) => {
  const localParameterStorage = JSON.parse(
    sessionStorage.getItem(PARAMETER_STORAGE_PATH)
  );
  const matchingParameterObject = localParameterStorage.find(
    (element) => element.activityId === activityId
  );
  const localParametersWithoutMatch = localParameterStorage.filter(
    (element) => element.activityId !== activityId
  );

  const matchingSingleParameter = matchingParameterObject.rpaParameters.find(
    (element) => element.name === parameterName
  );
  const singleParametersWithoutMatch = matchingParameterObject.rpaParameters.filter(
    (element) => element.name !== parameterName
  );

  const editedParameter = matchingSingleParameter;
  editedParameter.value = value.target.value;
  singleParametersWithoutMatch.push(editedParameter);

  const editedParameterObject = matchingParameterObject;
  editedParameterObject.rpaParameters = singleParametersWithoutMatch;
  localParametersWithoutMatch.push(editedParameterObject);

  sessionStorage.setItem(
    PARAMETER_STORAGE_PATH,
    JSON.stringify(localParametersWithoutMatch)
  );
};

/**
 * @description Will set the single parameter in local session storage
 * @param {String} activityId Id of the activity for which to change the value for
 * @param {String} parameterName Name of the parameter we want to change a property for
 * @param {String} property Name of the property we want to change
 * @param {Object} value The value object returned by the dropdown selection
 */
const setPropertyForParameter = (
  activityId,
  parameterName,
  property,
  value
) => {
  const localParameterStorage = JSON.parse(
    sessionStorage.getItem(PARAMETER_STORAGE_PATH)
  );
  const newLocalParameterStorage = localParameterStorage.map((element) => {
    if (element.activityId === activityId) {
      element.rpaParameters.map((elem) => {
        if (elem.name === parameterName) {
          // eslint-disable-next-line no-param-reassign
          elem[property] = value;
        }
        return elem;
      });
    }
    return element;
  });
  sessionStorage.setItem(
    PARAMETER_STORAGE_PATH,
    JSON.stringify(newLocalParameterStorage)
  );
};

/**
 * @description Will retrieve the local parameter storage and return the current value of the userInputRequired property
 * @param {string} robotId id of the selected robot
 * @param {string} activityId id of the selected activity
 * @param {string} parameterName The name of the parameter for which we want to get an update on the status of a property
 * @param {string} property The property of the parameters we want to get the current value of
 */
const parameterPropertyStatus = (
  robotId,
  activityId,
  parameterName,
  property
) => {
  const paramObj = getParameterObject(robotId, activityId);

  if (typeof paramObj !== 'undefined') {
    const rpaParameters = paramObj.rpaParameters.filter(
      (element) => element.name === parameterName
    );
    if (rpaParameters[0]) {
      return rpaParameters[0][property];
    }
  }

  return false;
};

/**
 * @description Will set the new value as the name of the output variable in local session storage
 * @param {String} activityId Id of the activity for which to change the value for
 * @param {String} value The new value for the name of the output variable
 */
const setOutputValueName = (activityId, value) => {
  const localParameterStorage = JSON.parse(
    sessionStorage.getItem(PARAMETER_STORAGE_PATH)
  );
  const matchingParameterObject = localParameterStorage.find(
    (element) => element.activityId === activityId
  );
  const localParametersWithoutMatch = localParameterStorage.filter(
    (element) => element.activityId !== activityId
  );

  const editedParameterObject = matchingParameterObject;
  editedParameterObject.outputVariable = value;
  localParametersWithoutMatch.push(editedParameterObject);

  sessionStorage.setItem(
    PARAMETER_STORAGE_PATH,
    JSON.stringify(localParametersWithoutMatch)
  );
};

export {
  setSingleParameter,
  setPropertyForParameter,
  parameterPropertyStatus,
  setOutputValueName,
};
