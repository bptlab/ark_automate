/**
 * @category Frontend
 * @module
 */

/**
 * @description Triggers parsing of the Ssot to .robot file
 * @returns returns .robot file code
 *  */
const getParsedRobotFile = async (robotId) =>
  fetch(`/robots/${robotId}/robotCode`);

/**
 * @description Fetch the ssot correlating to the specified Id
 * @param {String} robotId - Id of the robot that will be retrieved
 * @returns {Object} The found ssot
 */
const getSsot = async (robotId) => {
  const requestString = `/robots/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Rename the robot in the ssot
 * @param {String} robotId - RobotId of the robot that will be renamed
 * @param {String} newRobotName - String with the new RobotName
 * @returns {Object} Object containing robotName and starterId
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
 * @description Delete a robot by sending a call to the backend
 * @param {String} robotId Id of the robot that will be deleted
 * @returns {Object} Mongoose query describing execution of call
 */
const deleteRobotFromDB = async (robotId) => {
  const requestStringParameters = `/robots/${robotId}`;
  await fetch(requestStringParameters, { method: 'DELETE' }).catch((err) => {
    console.error(err);
  });
};

/**
 * @description Overwrites an existing sssot in the backend with a new one
 * @param {String} robotId Id of the robot that will be overwritten
 * @param {String} ssot New ssot that will be written to the database
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
  changeSsotName,
  deleteRobotFromDB,
  updateRobot,
};
