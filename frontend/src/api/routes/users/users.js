/**
 * @category Frontend
 * @module
 */

/**
 * @description Fetch all those ssot names and ids, which are available for the current user
 * @param { String } userId - UserId for which the ssots will be fetched
 */
const fetchSsotsForUser = async (userId) => {
  const requestString = `/users/${userId}/robots`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Create a new robot with the specified name for the specified user
 * @param {String} userId - The user for which the robot will be created
 * @param {String} robotName - The Name of the new robot
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

export { fetchSsotsForUser, createNewRobot /* , shareRobotWithUser */ };
