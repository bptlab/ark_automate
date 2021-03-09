/**
 * @category Client
 * @module
 */

/**
 * @description triggers parsing of the SSoT to .robot file and returns .robot file code
 */
const getParsedRobotFile = async () => fetch(`/ssot/parser/get-robot-code`);

export default getParsedRobotFile
