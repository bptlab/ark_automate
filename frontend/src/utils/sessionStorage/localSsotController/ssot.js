/**
 * @category Frontend
 * @module
 */
import customNotification from '../../componentsFunctionality/notificationUtils';
import {
  getSsot,
  updateRobot,
} from '../../../api/routes/robots/robotsRetrieval';
import {
  getAllAttributes,
  updateManyAttributes,
} from '../../../api/routes/robots/rpaAttributeRetrieval';
import { initSessionStorage } from '../sessionStorageUtils';
import {
  getAvailableApplications,
  getAllRpaFunctionalities,
} from '../../../api/routes/functionalities/functionalities';
import {
  getAllParametersForRobot,
  updateManyParameters,
} from '../../../api/routes/robots/rpaParameterRetrieval';
import { getParameterStorage, deleteUnusedParameterFromDB } from './parameters';
import {
  getAttributeStorage,
  deleteUnusedAttributesFromDB,
} from './attributes';

const ROBOT_ID_PATH = 'robotId';
const ATTRIBUTE_STORAGE_PATH = 'attributeLocalStorage';
const PARAMETER_STORAGE_PATH = 'parameterLocalStorage';

/**
 * @description Gets the robotId of the currently opened robot from the session storage
 * @returns Currently saved robotId
 */
const getRobotId = () => JSON.parse(sessionStorage.getItem(ROBOT_ID_PATH));

/**
 * @description Writes the robotId of the currently opened robot into the session storage
 * @param {String} robotId The robotId ot the currently opened robot
 */
const setRobotId = (robotId) => {
  sessionStorage.setItem(ROBOT_ID_PATH, JSON.stringify(robotId));
};

/**
 * @description Initializes the ssot in the session storage
 * @param {String} robotId Id of the robot for which we want to initialize the ssot in the session storage
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
      sessionStorage.setItem('attributeLocalStorage', JSON.stringify(data));
    })
    .catch((error) => {
      console.error(error);
    });

  getAllRpaFunctionalities(robotId)
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem(
        'TaskApplicationCombinations',
        JSON.stringify(data)
      );
    })
    .catch((error) => {
      console.error(error);
    });

  getAllParametersForRobot(robotId)
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem('parameterLocalStorage', JSON.stringify(data));
    })
    .catch((error) => {
      console.error(error);
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
 * @description Sends three backend calls to upsert the ssot, the attribute objects and the parameter objects to the database.
 * The objects are taken from the session storage, so no parameters are required.
 */
const upsert = async () => {
  const ssot = sessionStorage.getItem('ssotLocal');
  const usedElementIds = JSON.parse(ssot).elements.map(
    (singleElement) => singleElement.id
  );
  const robotId = getRobotId();
  updateRobot(robotId, ssot);

  const localAttributeStorage = getAttributeStorage();
  let stillUsedAttributes = localAttributeStorage.filter((singleAttribute) =>
    usedElementIds.includes(singleAttribute.activityId)
  );
  stillUsedAttributes = JSON.stringify(stillUsedAttributes);
  sessionStorage.setItem(ATTRIBUTE_STORAGE_PATH, stillUsedAttributes);

  deleteUnusedAttributesFromDB(localAttributeStorage, usedElementIds, robotId);
  updateManyAttributes(localAttributeStorage);

  const localParameterStorage = getParameterStorage();
  let stillUsedParameters = localParameterStorage.filter((singleParameter) =>
    usedElementIds.includes(singleParameter.activityId)
  );
  stillUsedParameters = JSON.stringify(stillUsedParameters);
  sessionStorage.setItem(PARAMETER_STORAGE_PATH, stillUsedParameters);

  deleteUnusedParameterFromDB(localParameterStorage, usedElementIds, robotId);
  updateManyParameters(localParameterStorage);
  customNotification(
    'Success',
    'Successfully saved to cloud',
    'CloudUploadOutlined'
  );
};

export { setRobotId, initSsotSessionStorage, upsert };
