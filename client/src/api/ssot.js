/**
 * @category Client
 * @module
 */

/**
 * @description triggers parsing of the SSoT to .robot file and returns .robot file code
 */
const getParsedRobotFile = async () => {
  const response = await fetch(`/ssot/parser/get-robot-code`);
  return response;
};

export { getParsedRobotFile };
