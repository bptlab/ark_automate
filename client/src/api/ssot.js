/**
 * @category Client
 * @module
 */

/**
 * @description triggers parsing of the SSoT to .robot file and returns .robot file code
 */
const getParsedRobotFile = async (robotId) =>
  fetch(`/robots/${robotId}/robotCode`);

export default getParsedRobotFile;
