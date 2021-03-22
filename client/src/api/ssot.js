/**
 * @category Client
 * @module
 */

/**
 * @description triggers parsing of the SSoT to .robot file and returns .robot file code
 */
const getParsedRobotFile = async (botId) => fetch(`/ssot/parser/getForId/${botId}`);

export default getParsedRobotFile
