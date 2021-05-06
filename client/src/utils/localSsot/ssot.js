/**
 * @category Client
 * @module
 */
import { getSsot } from '../../api/ssotRetrieval';
import { getAllAttributes } from '../../api/attributeRetrieval';
import { initSessionStorage } from '../sessionStorageUtils/sessionStorageUtils';
import {
  getAvailableApplications,
  getAllParameters,
} from '../../api/applicationAndTaskSelection';
import { getAllParametersForRobot } from '../../api/variableRetrieval';

const ROBOT_ID_PATH = 'robotId';

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

export { getRobotId, setRobotId, initSsotSessionStorage };
