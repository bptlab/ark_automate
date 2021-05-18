/**
 * @category Frontend
 * @module
 */
import { deleteAttributesForActivities } from '../../../api/routes/robots/rpaAttributes';

const ATTRIBUTE_STORAGE_PATH = 'attributeLocalStorage';

/**
 * @description Will get the attribute object array from the session storage
 * @returns {Array} parameter local storage
 */
const getAttributeStorage = () =>
  JSON.parse(sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH));

/**
 * @description Will get the attribute object for an activiy from session storage
 * @param {String} activityId Id of the activity for which to get the attribute object
 * @returns The attribute object for the selected activity or undefined if not available
 */
const getAttributeObjectForActivity = (activityId) => {
  const localAttributeStorage = JSON.parse(
    sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH)
  );
  return localAttributeStorage.find(
    (element) => element.activityId === activityId
  );
};

/**
 * @description This function gets the selected rpa task for the selected activity from session storage
 * @param {String} activityId Id of the currently selected activity
 * @returns The selected rpa task for the selected activity from session storage or undefined if not available
 */
const getRpaTask = (activityId) => {
  const matchingEntry = getAttributeObjectForActivity(activityId);
  if (matchingEntry) {
    return matchingEntry.rpaTask;
  }
  return undefined;
};

/**
 * @description Stores the rpa task for the currently selected activity in the session storage
 * @param {string} robotId Id of the currently opened robot
 * @param {string} activityId Id of the currently selected activity
 * @param {string} application Name of the selected application
 * @param {string} newTask Name of the selected task
 */
const setRpaTask = (robotId, activityId, application, newTask) => {
  const localAttributeStorage = JSON.parse(
    sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH)
  );
  let matchingEntry = localAttributeStorage.find(
    (element) => element.activityId === activityId
  );
  const newLocalAttributeStorage = localAttributeStorage.filter(
    (element) =>
      element.robotId === robotId && element.activityId !== activityId
  );

  if (matchingEntry) {
    matchingEntry.rpaTask = newTask;
  } else {
    matchingEntry = {
      activityId,
      robotId,
      rpaApplication: application,
      rpaTask: newTask,
    };
  }

  newLocalAttributeStorage.push(matchingEntry);
  sessionStorage.setItem(
    ATTRIBUTE_STORAGE_PATH,
    JSON.stringify(newLocalAttributeStorage)
  );
};

/**
 * @description Sets the rpaApplication attribute for an activity to a new application and sets rpaTask to undefined
 * @param {string} robotId Id of the currently opened robot
 * @param {string} activityId Id of the currently selected activity
 * @param {string} newApplication Name of the selected rpa application
 */
const setRpaApplication = (robotId, activityId, newApplication) => {
  const localAttributeStorage = JSON.parse(
    sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH)
  );
  let matchingEntry = localAttributeStorage.find(
    (element) => element.activityId === activityId
  );
  const newLocalAttributeStorage = localAttributeStorage.filter(
    (element) =>
      element.robotId === robotId && element.activityId !== activityId
  );

  if (matchingEntry) {
    matchingEntry.rpaApplication = newApplication;
  } else {
    matchingEntry = {
      activityId,
      robotId,
      rpaApplication: newApplication,
    };
  }

  matchingEntry.rpaTask = undefined;
  newLocalAttributeStorage.push(matchingEntry);
  sessionStorage.setItem(
    ATTRIBUTE_STORAGE_PATH,
    JSON.stringify(newLocalAttributeStorage)
  );
};

/**
 * @description Gets the rpa application for the selected activity from session storage
 * @param {String} activityId Id of the currently selected activity
 * @returns The selected rpa application for the selected activity or undefined
 */
const getRpaApplication = (activityId) => {
  const matchingEntry = getAttributeObjectForActivity(activityId);
  let selectedApplication;
  if (matchingEntry) {
    selectedApplication = matchingEntry.rpaApplication;
  }
  return selectedApplication;
};

/**
 * @description If there is more than one unused attribute object, delete it in the database
 * @param {Array} attributes List of all attributes saved in the session storage
 * @param {Array} usedElementIds The activityIds that are still being used
 * @param {String} robotId The Id of the robot
 */
const deleteUnusedAttributesFromDB = (attributes, usedElementIds, robotId) => {
  const unusedAttributes = attributes.filter(
    (singleAttribute) => !usedElementIds.includes(singleAttribute.activityId)
  );
  if (unusedAttributes && unusedAttributes.length > 0) {
    const unusedActivityIds = unusedAttributes.map(
      (unusedAttributeObject) => unusedAttributeObject.activityId
    );
    deleteAttributesForActivities(robotId, unusedActivityIds);
  }
};

export {
  getAttributeStorage,
  getAttributeObjectForActivity,
  getRpaTask,
  setRpaTask,
  setRpaApplication,
  getRpaApplication,
  deleteUnusedAttributesFromDB,
};
