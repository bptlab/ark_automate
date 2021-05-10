/**
 * @category Client
 * @module
 */

/**
 * @description Fetch the ssot correlating to the specified Id
 * @param { String } robotId - String including the Id of the robot to be retrieved
 */
const getSsotFromDB = async (robotId) => {
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

export {
  getSsotFromDB,
  fetchSsotsForUser,
  changeSsotName,
  createNewRobot,
  deleteRobotFromDB,
};
