/**
 * @category Client
 * @module
 */

/**
 * @description Fetch tasklist from Mongo-DB
 * @param {String} application - String with currently selected application from ApplicationDropdown
 */
const setRobotJob = async (robotId) => {
  const response = await fetch(`/robot/jobs/add?robotId=${robotId}`);
  return response;
};

export default setRobotJob;
