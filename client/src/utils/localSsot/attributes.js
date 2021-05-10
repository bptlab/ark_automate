/**
 * @category Client
 * @module
 */

const ATTRIBUTE_STORAGE_PATH = 'attributeLocalStorage';

/**
 * @description Will get the parameter object for an activiy in local session storage
 * @param {String} activityId Id of the activity for which to change the value for
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
 * @description This function gets the selected RPA task for the selected activity from the session storage
 * @param {String} activityId Id of the currently selected activity
 * @returns The selected RPA task for the selected activity from session storage
 */
const getRpaTask = (activityId) => {
  const localAttributeStorage = JSON.parse(
    sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH)
  );
  const matchingEntry = localAttributeStorage.find(
    (element) => element.activityId === activityId
  );

  let selectedTask;
  if (matchingEntry) {
    selectedTask = matchingEntry.rpaTask;
  }
  return selectedTask;
};

/**
 * @description Stores the RPA Task for the currently selected activity in the session storage
 * @param {string} robotId Id of the currently opened robot
 * @param {string} activityId Id of the currently selected activity
 * @param {string} application Name of the selected application
 * @param {string} newTask Name of the selected task from dropdown
 */
const setRpaTask = (robotId, activityId, application, newTask) => {
  const localApplicationTaskStorage = JSON.parse(
    sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH)
  );

  let matchingActivity = localApplicationTaskStorage.find(
    (element) => element.activityId === activityId
  );
  const arrayWithoutMatchingElement = localApplicationTaskStorage.filter(
    (element) =>
      element.robotId === robotId && element.activityId !== activityId
  );

  if (matchingActivity) {
    matchingActivity.rpaTask = newTask;
  } else {
    matchingActivity = {
      activityId,
      robotId,
      rpaApplication: application,
      rpaTask: newTask,
    };
  }

  arrayWithoutMatchingElement.push(matchingActivity);
  sessionStorage.setItem(
    ATTRIBUTE_STORAGE_PATH,
    JSON.stringify(arrayWithoutMatchingElement)
  );
};

/**
 * @description Retireves or creates a new attribute object for the given activity and will set the task to undefined.
 * Use this function to reset the associated task for that activity.
 * @param {string} robotId Id of the currently opened robot
 * @param {string} activityId Id of the currently selected activity
 * @param {string} newApplication Name of the selected RPA application
 */
const resetRpaApplication = (robotId, activityId, newApplication) => {
  const localApplicationTaskStorage = JSON.parse(
    sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH)
  );

  let matchingActivity = localApplicationTaskStorage.find(
    (element) => element.activityId === activityId
  );
  const arrayWithoutMatchingElement = localApplicationTaskStorage.filter(
    (element) =>
      element.robotId === robotId && element.activityId !== activityId
  );

  if (matchingActivity) {
    matchingActivity.rpaApplication = newApplication;
  } else {
    matchingActivity = {
      activityId,
      robotId,
      rpaApplication: newApplication,
    };
  }

  matchingActivity.rpaTask = undefined;
  arrayWithoutMatchingElement.push(matchingActivity);
  sessionStorage.setItem(
    ATTRIBUTE_STORAGE_PATH,
    JSON.stringify(arrayWithoutMatchingElement)
  );
};

/**
 * @param {String} activityId id of the currently selected activity
 * @description this util function returns the RPA application for the selected activity
 * @returns the selected RPA application for the selected activity from localStorage
 */
const getRpaApplication = (activityId) => {
  const localApplicationTaskStorage = JSON.parse(
    sessionStorage.getItem(ATTRIBUTE_STORAGE_PATH)
  );
  const matchingEntry = localApplicationTaskStorage.find(
    (element) => element.activityId === activityId
  );

  let selectedApplication;
  if (matchingEntry) {
    selectedApplication = matchingEntry.rpaApplication;
  }
  return selectedApplication;
};

export {
  getAttributeObjectForActivity,
  getRpaTask,
  setRpaTask,
  resetRpaApplication,
  getRpaApplication,
};
