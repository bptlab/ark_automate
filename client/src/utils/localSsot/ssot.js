/**
 * @category Client
 * @module
 */
import customNotification from '../notificationUtils';
import {
  getSsot,
  deleteParametersForActivities,
  deleteAttributesForActivities,
  updateRobot,
} from '../../api/ssotRetrieval';
import {
  getAllAttributes,
  updateManyAttributes,
} from '../../api/attributeRetrieval';
import { initSessionStorage } from '../sessionStorageUtils/sessionStorageUtils';
import {
  getAvailableApplications,
  getAllParameters,
} from '../../api/applicationAndTaskSelection';
import {
  getAllParametersForRobot,
  updateManyParameters,
} from '../../api/variableRetrieval';

const ROBOT_ID_PATH = 'robotId';
const APPLICATION_TASK_STORAGE_PATH = 'attributeLocalStorage';
const PARAMETER_STORAGE_PATH = 'parameterLocalStorage';

/**
 * @description This function gets the robotId of the currently opened robot from the session storage
 * @returns Currently saved robotId from session storage
 */
const getRobotId = () => JSON.parse(sessionStorage.getItem(ROBOT_ID_PATH));

/**
 * @description This function writes the robotId of the currently opened robot to the session storage
 * @param {String} robotId The robotId ot the currently opened robot
 */
const setRobotId = (robotId) => {
  sessionStorage.setItem(ROBOT_ID_PATH, JSON.stringify(robotId));
};

/**
 * @description Will initialize the ssot in local session storage
 * @param {String} robotId Id of the robot for which we want to initialize the ssot locally
 */
const initSsotSessionStorage = (robotId) => {
  getSsot(robotId)
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem('ssotLocal', JSON.stringify(data));
      sessionStorage.setItem('robotName', data.robotName);
    })
    .catch((error) => {
      console.error(error);
    });

  getAllAttributes(robotId)
    .then((response) => response.json())
    .then((data) => {
      initSessionStorage('attributeLocalStorage', JSON.stringify([]));
      sessionStorage.setItem('attributeLocalStorage', JSON.stringify(data));
    });

  getAllParameters(robotId)
    .then((response) => response.json())
    .then((data) => {
      initSessionStorage('TaskApplicationCombinations', JSON.stringify([]));
      sessionStorage.setItem(
        'TaskApplicationCombinations',
        JSON.stringify(data)
      );
    });

  getAllParametersForRobot(robotId)
    .then((response) => response.json())
    .then((data) => {
      initSessionStorage('parameterLocalStorage', JSON.stringify([]));
      sessionStorage.setItem('parameterLocalStorage', JSON.stringify(data));
    });

  initSessionStorage('taskToApplicationCache', JSON.stringify({}));
  initSessionStorage('availableApplications', JSON.stringify([]));
  const applicationList = JSON.parse(
    sessionStorage.getItem('availableApplications')
  );
  if (applicationList && applicationList.length < 1)
    getAvailableApplications()
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('availableApplications', JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
      });
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

export { getRobotId, setRobotId, initSsotSessionStorage, upsert };
