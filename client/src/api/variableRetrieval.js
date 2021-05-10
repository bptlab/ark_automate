/**
 * @category Client
 * @module
 */

/**
 * @description Fetch all parameter objects for a specifc robot
 * @param { String } robotId Id of the robot we want to get all the parameters for
 */
const getAllParametersForRobot = async (robotId) => {
  const requestString = `/robots/parameters/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

export { getAllParametersForRobot };
