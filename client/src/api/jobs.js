/**
 * @category Client
 * @module
 */

/**
 * @description Fetch tasklist from Mongo-DB
 * @param {String} application - String with currently selected application from ApplicationDropdown
 */
const setRobotJob = async (robotId, userId) => {
  console.log(userId);
  console.log(`/jobs/new?userId=${userId}&robotId=${robotId}`);
  const response = await fetch(`/jobs/new?userId=${userId}&robotId=${robotId}`);
  return response;
};

export default setRobotJob;
