/**
 * @category Client
 * @module
 */

/**
 * @description Fetch all those SSOT names and Ids, which are available for the current user
 * @param {String} userId - String including the user Id
 */
const fetchSSOTsForUser = async (userId) => {
  const requestString = `/ssot/getAvailableBotsForUser/${userId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Fetch all those SSOT names and Ids, which are available for the current user
 * @param {String} userId - String including the user Id
 */
const changeSSOTName = async (SSOTid, newName) => {
  const adjustedName = newName.replace(/\s/g, '+');
  const requestString = `/ssot/renameBot?id=${SSOTid}&newName=${adjustedName}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Fetch all those SSOT names and Ids, which are available for the current user
 * @param {String} userId - String including the user Id
 */
const retrieveMetadataForBot = async (robotId) => {
  const requestString = `/ssot/retrieveMetadataForBot/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Create a new robot with the specified name for the specified user 
 * @param {String} newName - String including the user Id
 */
const createNewBot = async (userid, newName) => {
  const adjustedName = newName.replace(/\s/g, '+');
  const requestString = `/ssot/createNewBot?userid=${userid}&botName=${adjustedName}`;
  const response = await fetch(requestString);
  return response;
};

export {
  fetchSSOTsForUser,
  changeSSOTName,
  retrieveMetadataForBot,
  createNewBot
};
