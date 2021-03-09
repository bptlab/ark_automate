/**
 * @category Client
 * @module
 */

/**
 * @description Fetch all those SSOT names and Ids, which are available for the current user
 * @param {String} userId - String including the user Id
 */
 const fetchSSOTsForUser = async (userId) => {
    const requestString = `/ssot/getAvailableBotsForUser/${ userId }`;
    const response = await fetch(requestString);
    return response;
  };

export default fetchSSOTsForUser;
