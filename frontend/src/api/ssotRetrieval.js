/**
 * @category Frontend
 * @module
 */

/**
 * @description triggers parsing of the SSoT to .robot file and returns .robot file code
 */
const getParsedRobotFile = async (robotId) =>
  fetch(`/robots/${robotId}/robotCode`);

/**
 * @description Fetch the ssot correlating to the specified Id
 * @param { String } robotId - String including the Id of the robot to be retrieved
 */
const getSsot = async (robotId) => {
  const requestString = `/robots/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Fetch all those ssot names and ids, which are available for the current user
 * @param { String } userId - String including the user id
 */
const fetchSsotsForUser = async (userId) => {
  const requestString = `/users/${userId}/robots`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description This function renames the robot in the ssot
 * @param { String } robotId - String including the robotId
 * @param { String } newRobotName - String with the new RobotName
 */
const changeSsotName = async (robotId, newRobotName) => {
  const payload = {
    newRobotName,
  };
  const requestString = `/robots/${robotId}/robotName`;
  const requestParams = {
    body: JSON.stringify(payload),
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  };
  const response = await fetch(requestString, requestParams);
  return response;
};

/**
 * @description Create a new robot with the specified name for the specified user
 * @param {String} newName - String including the userId
 */
const createNewRobot = async (userId, robotName) => {
  const body = {
    userId,
    robotName,
  };
  const requestString = `/users/${userId}/robots`;
  const response = await fetch(requestString, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  return response;
};

/**
 * @description Will send a backend call to delete a robot
 * @param {String} robotId Id of the robot that is deleted
 */
const deleteRobotFromDB = async (robotId) => {
  const requestStringParameters = `/robots/${robotId}`;
  await fetch(requestStringParameters, { method: 'DELETE' }).catch((err) => {
    console.error(err);
  });
};

/**
 * @description Sends a callout to the backend to delete parameters for the given activities
 * @param {String} robotId Id of the robot that is being used
 * @param {String} unusedActivityListString Stringified List of Activity Ids
 */
const deleteParametersForActivities = (robotId, activityIdList) => {
  const requestStringParameters = `/robots/parameters/${robotId}`;
  fetch(requestStringParameters, {
    body: JSON.stringify({ activityIdList }),
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }).catch((err) => {
    console.error(err);
  });
};

/**
 * @description Sends a callout to the backend to delete attributes for the given activities
 * @param {String} robotId Id of the robot that is being used
 * @param {String} unusedActivityListString Stringified List of Activity Ids
 */
const deleteAttributesForActivities = (robotId, activityIdList) => {
  const requestStringParameters = `/robots/parameters/${robotId}`;
  fetch(requestStringParameters, {
    method: 'DELETE',
    body: JSON.stringify({ activityIdList }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }).catch((err) => {
    console.error(err);
  });
};

/**
 * @description Overwrites an existing sssot in the backend with a new one
 * @param {String} robotId Id of the robot that is being overwritten
 * @param {String} ssot New ssot to be written to the database
 * @returns {Object} Updated ssot object
 */
const updateRobot = async (robotId, ssot) => {
  const requestStringSsot = `/robots/${robotId}`;
  // eslint-disable-next-line no-unused-vars
  const response = await fetch(requestStringSsot, {
    body: ssot,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  return response;
};

export {
  getParsedRobotFile,
  getSsot,
  fetchSsotsForUser,
  changeSsotName,
  createNewRobot,
  deleteRobotFromDB,
  deleteParametersForActivities,
  deleteAttributesForActivities,
  updateRobot,
};
