/**
 * @category Client
 * @module
 */
import getRpaFunctionalitiesObject from '../rpaFunctionality/functionalities';
import { getAttributeObjectForActivity } from './attributes';

const PARAMETER_STORAGE_PATH = 'parameterLocalStorage';

/**
 * @description Will create a parameter object in the parameter session storage
 * @param {Array} localParameterStorage An Array containing the current parameter objects
 * @param {string} robotId The id of the selected robot
 * @param {string} activityId The id of the selected activity
 * @param {String} application The name of the rpa application the activity has selected
 * @param {String} task The name of the rpa task the activity has selected
 * @returns {Object} Newly created parameter object
 */
const createParameterObject = (
  localParameterStorage,
  robotId,
  activityId,
  application,
  task
) => {
  // hole mir alle RPA-task Objects und finde das passende für die Task und Application
  const matchingComboObject = getRpaFunctionalitiesObject(application, task);

  // Falls es ein passendes Rpa-task Object gibt und dieses auch Eingabeparameter hat, dann kopiere die Eingabeparameter Objekte
  const rpaParameters = [];
  if (matchingComboObject && matchingComboObject.inputVars) {
    matchingComboObject.inputVars.forEach((element) => {
      const elementCopy = element;
      elementCopy.value = '';
      rpaParameters.push(elementCopy);
    });
  }

  // erstelle nun ein parameter object für die Aktivität
  const matchingParameterObject = {
    activityId,
    outputVariable:
      matchingComboObject && matchingComboObject.outputValue
        ? `${activityId}_output`
        : undefined,
    rpaParameters,
    robotId,
  };

  // füge das neue Parameter object dem parameter session storage hinzu und gebe es zurück
  localParameterStorage.push(matchingParameterObject);
  sessionStorage.setItem(
    'parameterLocalStorage',
    JSON.stringify(localParameterStorage)
  );
  return matchingParameterObject;
};

/**
 * @description Will get the parameter object local session storage
 * @returns {Array} parameter local storage
 */
const getParameterStorage = () =>
  JSON.parse(sessionStorage.getItem(PARAMETER_STORAGE_PATH));

/**
 * @description Will get the parameter object for an activiy in local session storage
 * @param {String} activityId Id of the activity for which to change the value for
 */
const getParameterObjectForActivity = (activityId) => {
  const localParameterStorage = JSON.parse(
    sessionStorage.getItem(PARAMETER_STORAGE_PATH)
  );
  return localParameterStorage.find(
    (element) => element.activityId === activityId
  );
};

/**
 * @description Will check if the parameter object is filled correctly
 * @param {String} parameterObject The parameter object for which to check if it is filled correctly
 * @param {String} rpaFunctionalitiesObject The rpa functionalities object (rpa-task) needed to check for correctness
 */
const checkIfParameterObjectCorrect = (
  parameterObject,
  rpaFunctionalitiesObject
) => {
  if (
    rpaFunctionalitiesObject &&
    rpaFunctionalitiesObject.inputVars.length &&
    parameterObject.rpaParameters.length
  ) {
    const comboParameterLength = rpaFunctionalitiesObject.inputVars.length;
    const parameterObjectLength = parameterObject.rpaParameters.length;
    const comboFirstParamInfoText = rpaFunctionalitiesObject.inputVars.find(
      (element) => element.index === 0
    ).infoText;
    const firstParamInfoText = parameterObject.rpaParameters.find(
      (element) => element.index === 0
    ).infoText;

    if (
      comboParameterLength === parameterObjectLength &&
      comboFirstParamInfoText === firstParamInfoText
    ) {
      return true;
    }
    return false;
  }
  return undefined;
};

/**
 * @description Gets the parameter object for the activity from the session storage and checks if the paramter object is correctly filled.
 * If no paramter object for the activity exists but an attribute object then it will create a new parameter object and add it to the session storage.
 * If no parameter object and no attributes object exists for the activity it will return undefined.
 * @param {String} robotId Id of the robot/ssot for which to retrieve the value
 * @param {String} activityId Id of the activity for which to retrieve the value for
 * @returns {Object} The parameter object the activity has
 */
const getParameterObject = (robotId, activityId) => {
  // get all parameter objects from session storage and check if for activity id a parameter object is already saved in session storage
  let localParameterStorage = getParameterStorage();
  const matchingParameterObject = getParameterObjectForActivity(activityId);
  const matchingAttributeObject = getAttributeObjectForActivity(activityId);
  if (matchingParameterObject) {
    const application = matchingAttributeObject.rpaApplication;
    const task = matchingAttributeObject.rpaTask;
    const matchingComboObject = getRpaFunctionalitiesObject(application, task);
    if (
      checkIfParameterObjectCorrect(
        matchingParameterObject,
        matchingComboObject
      )
    ) {
      return matchingParameterObject;
    }
    localParameterStorage = localParameterStorage.filter(
      (element) => element.activityId !== activityId
    );
  }

  // Jetzt beginnt der Fall, dass es kein parameter object für diese Aktivität bisher im session storage gibt

  // Hier holen wir uns jetzt das entsprechende attributeObject zur Aktivität und ziehen uns die task und die Application (falls bereits vorhanden)

  const application =
    matchingAttributeObject !== undefined
      ? matchingAttributeObject.rpaApplication
      : undefined;
  const task =
    matchingAttributeObject !== undefined
      ? matchingAttributeObject.rpaTask
      : undefined;

  if (application && task) {
    return createParameterObject(
      localParameterStorage,
      robotId,
      activityId,
      application,
      task
    );
  }

  // falls es kein Parameter Object und kein Attribute Object zu der Aktivität gibt, dann gib undefined zurück
  return undefined;
};

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
  getParameterStorage,
  getParameterObjectForActivity,
  setSingleParameter,
  setPropertyForParameter,
  parameterPropertyStatus,
  setOutputValueName,
  checkIfParameterObjectCorrect,
  createParameterObject,
  getParameterObject,
};
