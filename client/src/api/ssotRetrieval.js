/**
 * @category Client
 * @module
 */

/**
* @description Fetch the ssot correlating to the specified Id
* @param { String } robotId - String including the Id of the robot to be retrieved
*/
const getSsotFromDB = async (robotId) => {
  const requestString = `/ssot/get/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

/**
* @description Fetch all those Ssot names and Ids, which are available for the current user
* @param { String } userId - String including the user Id
*/
const fetchSsotsForUser = async (userId) => {
  const requestString = `/ssot/getAvailableRobotsForUser/${userId}`;
  const response = await fetch(requestString);
  return response;
};

/** 
* @description This function renames the robot in Ssot
* @param { String } ssotId - String including the ssotId
* @param { String } newName - String with the new RobotName
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

/**
 * @description will send the call to the backend to overwrite the ssot stored in the database with the given one
 * @param {String} robotId - String including the robotId
 * @param {Object} newSsot - the ssot to overwrite the existing one
 */
const updateSsot = async (
  robotId,
  newSsot) => {
  const requestString = `/ssot/overwriteRobot/${robotId}`;
  const response = await fetch(requestString,
    {
      body: JSON.stringify(newSsot),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
  return response;
};

export {
  getSsotFromDB,
  fetchSsotsForUser,
  changeSsotName,
  retrieveMetadataForBot,
  createNewRobot,
  updateSsot,
};
