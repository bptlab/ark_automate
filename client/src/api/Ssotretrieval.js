/**
 * @category Client
 * @module
 */

/**
 * @description Fetch all those Ssot names and Ids, which are available for the current user
 * @param {String} userId - String including the user Id
 */
const fetchSsotsForUser = async (userId) => {
  const requestString = `/ssot/getAvailableRobotsForUser/${userId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description This function renames the robot in Ssot
 * @param {String} ssotId - String including the ssotId
 * @param {String} newName - String with the new RobotName
 */
const changeSsotName = async (ssotId, newName) => {
  const adjustedName = newName.replace(/\s/g, '+');
  const requestString = `/ssot/renameRobot?id=${ssotId}&newName=${adjustedName}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Fetches all the Metadata for a single Robot
 * @param {String} robotId - String including the robotId
 */
const retrieveMetadataForBot = async (robotId) => {
  const requestString = `/ssot/retrieveMetadataForRobot/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Create a new robot with the specified name for the specified user
 * @param {String} newName - String including the user Id
 */
const createNewRobot = async (userid, newName) => {
  const adjustedName = newName.replace(/\s/g, '+');
  const requestString = `/ssot/createNewRobot?userid=${userid}&robotName=${adjustedName}`;
  const response = await fetch(requestString);
  return response;
};

export {
  fetchSsotsForUser,
  changeSsotName,
  retrieveMetadataForBot,
  createNewRobot,
};
