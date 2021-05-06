import customNotification from './notificationUtils';
/**
 * @category Client
 * @module
 */

import { updateManyAttributes } from '../api/attributeRetrieval';
import { updateManyParameters } from '../api/variableRetrieval';
import {
  deleteParametersForActivities,
  deleteAttributesForActivities,
  updateRobot,
} from '../api/ssotRetrieval';

/**
 * appTaskLocalStorage
 */

const ROBOT_ID_PATH = 'robotId';
const APPLICATION_TASK_STORAGE_PATH = 'attributeLocalStorage';
const PARAMETER_STORAGE_PATH = 'parameterLocalStorage';

/**
 * @description Will retrieve the value of the input variables name from either session storage,
 * or create a new one and will save it in local session storage.
 * If an existing parameter object has been found there will be a check happening, if the signature matches
 * the one specified for that activities task and application. If not, then something must have been out of sync
 * and a new object will be created and saved to sessionStorage.
 * @param {String} robotId Id of the robot/ssot for which to retrieve the value
 * @param {String} activityId Id of the activity for which to retrieve the value for
 * @returns {Object} The parameter object the activity has
 */
const getParameterObject = (robotId, activityId) => {
  let localParameterStorage = JSON.parse(
    sessionStorage.getItem('parameterLocalStorage')
  );
  let matchingParameterObject = localParameterStorage.find(
    (element) => element.activityId === activityId
  );

  if (matchingParameterObject) {
    const localAttributeStorage = JSON.parse(
      sessionStorage.getItem('attributeLocalStorage')
    );
    const matchingAttributeObject = localAttributeStorage.find(
      (element) => element.activityId === activityId
    );
    const application = matchingAttributeObject.rpaApplication;
    const task = matchingAttributeObject.rpaTask;

    const localComboStorage = JSON.parse(
      sessionStorage.getItem('TaskApplicationCombinations')
    );
    const matchingComboObject = localComboStorage.find(
      (element) => element.Application === application && element.Task === task
    );

    if (
      matchingComboObject &&
      matchingComboObject.inputVars.length &&
      matchingParameterObject.rpaParameters.length
    ) {
      // In the future there could be a need for a more advanced signature check, but fur the current use cases this should be sufficient
      const comboParameterLength = matchingComboObject.inputVars.length;
      const parameterObjectLength =
        matchingParameterObject.rpaParameters.length;
      const comboFirstParamInfoText = matchingComboObject.inputVars.find(
        (element) => element.index === 0
      ).infoText;
      const firstParamInfoText = matchingParameterObject.rpaParameters.find(
        (element) => element.index === 0
      ).infoText;

      if (
        comboParameterLength === parameterObjectLength &&
        comboFirstParamInfoText === firstParamInfoText
      ) {
        return matchingParameterObject;
      }
    }
  }

  localParameterStorage = localParameterStorage.filter(
    (element) => element.activityId !== activityId
  );
  const localAttributeStorage = JSON.parse(
    sessionStorage.getItem('attributeLocalStorage')
  );

  const matchingAttributeObject = localAttributeStorage.find(
    (element) => element.activityId === activityId
  );

  const application =
    matchingAttributeObject !== undefined
      ? matchingAttributeObject.rpaApplication
      : undefined;
  const task =
    matchingAttributeObject !== undefined
      ? matchingAttributeObject.rpaTask
      : undefined;

  if (application && task) {
    const localComboStorage = JSON.parse(
      sessionStorage.getItem('TaskApplicationCombinations')
    );
    const matchingComboObject = localComboStorage.find(
      (element) => element.Application === application && element.Task === task
    );

    const rpaParameters = [];
    if (matchingComboObject && matchingComboObject.inputVars) {
      matchingComboObject.inputVars.forEach((element) => {
        const elementCopy = element;
        elementCopy.value = '';
        rpaParameters.push(elementCopy);
      });
    }

    matchingParameterObject = {
      activityId,
      outputVariable:
        matchingComboObject && matchingComboObject.outputValue
          ? `${activityId}_output`
          : undefined,
      rpaParameters,
      robotId,
    };

    localParameterStorage.push(matchingParameterObject);
    sessionStorage.setItem(
      'parameterLocalStorage',
      JSON.stringify(localParameterStorage)
    );
    return matchingParameterObject;
  }
  return undefined;
};

/**
 * @description If there is more than one unused parameter Object, delete it in the DB
 * @param {Array} parameterObject List of all parameters saved in the sessionStorage
 * @param {Array} usedElementIds The activityIds that are still being used
 * @param {String} robotId The Id of the robot
 */
const deleteUnusedParameterFromDB = (
  parameterObject,
  usedElementIds,
  robotId
) => {
  const unusedParameters = parameterObject.filter(
    (singleParameter) => !usedElementIds.includes(singleParameter.activityId)
  );
  if (unusedParameters && unusedParameters.length > 0) {
    let unusedParameterIds = unusedParameters.map(
      (singleUnusedParameter) => singleUnusedParameter.activityId
    );
    unusedParameterIds = JSON.stringify(unusedParameterIds);
    deleteParametersForActivities(robotId, unusedParameterIds);
  }
};

/**
 * @description If there is more than one unused attribute Object, delete it in the DB
 * @param {Array} attributes List of all attributes saved in the sessionStorage
 * @param {Array} usedElementIds The activityIds that are still being used
 * @param {String} robotId The Id of the robot
 */
const deleteUnusedAttributesFromDB = (attributes, usedElementIds, robotId) => {
  const unusedAttributes = attributes.filter(
    (singleAttribute) => !usedElementIds.includes(singleAttribute.activityId)
  );
  if (unusedAttributes && unusedAttributes.length > 0) {
    let unusedAttributeIds = unusedAttributes.map(
      (singleUnusedAttribute) => singleUnusedAttribute.activityId
    );
    unusedAttributeIds = JSON.stringify(unusedAttributeIds);
    deleteAttributesForActivities(robotId, unusedAttributeIds);
  }
};

/**
 * @description Will send three backend calls to upsert the ssot, the attribute objects and the parameter objects to the database.
 * The objects are taken from the session storage, so no parameters are required
 */
const upsert = async () => {
  const ssot = sessionStorage.getItem('ssotLocal');
  const usedElementIds = JSON.parse(ssot).elements.map(
    (singleElement) => singleElement.id
  );
  const robotId = JSON.parse(sessionStorage.getItem(ROBOT_ID_PATH));
  updateRobot(robotId, ssot);

  const attributes = JSON.parse(
    sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH)
  );
  let stillUsedAttributes = attributes.filter((singleAttribute) =>
    usedElementIds.includes(singleAttribute.activityId)
  );
  stillUsedAttributes = JSON.stringify(stillUsedAttributes);
  sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, stillUsedAttributes);

  deleteUnusedAttributesFromDB(attributes, usedElementIds, robotId);
  updateManyAttributes(stillUsedAttributes);

  const parameterObject = JSON.parse(
    sessionStorage.getItem(PARAMETER_STORAGE_PATH)
  );
  let stillUsedParameters = parameterObject.filter((singleParameter) =>
    usedElementIds.includes(singleParameter.activityId)
  );
  stillUsedParameters = JSON.stringify(stillUsedParameters);
  sessionStorage.setItem(PARAMETER_STORAGE_PATH, stillUsedParameters);

  deleteUnusedParameterFromDB(parameterObject, usedElementIds, robotId);
  updateManyParameters(stillUsedParameters);

  customNotification(
    'Success',
    'Successfully saved to cloud',
    'CloudUploadOutlined'
  );
};

export {
  getParameterObject, // to be refactored completely seperately
  upsert,
};
