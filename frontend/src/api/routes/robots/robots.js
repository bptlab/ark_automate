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
 * @description Overwrites an existing sssot in the backend with a new one
 * @param {String} robotId Id of the robot that is being overwritten
 * @param {String} ssot New ssot to be written to the database
 * @returns {Object} Updated ssot object
 */
const updateRobot = async (robotId, ssot) => {
  const requestStringSsot = `/robots/${robotId}`;
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
  changeSsotName,
  deleteRobotFromDB,
  updateRobot,
};
