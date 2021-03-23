/**
 * @category Client
 * @module
 */

/**
* @description Will retrieve the needed variables for a new application/task tuple and return that, as well as updating the ssot with those new variables
* @param {String} robotId - String including the Id of the robot
* @param {String} activityId - String including the Id of the activity
* @param {String} application - String including the application
* @param {String} task - String including the task
*/
const variablesForNewTask = async (
  robotId,
  activityId,
  application,
  task
) => {
  const applicationWithoutEmptyspaces = application.replace(/\s/g, '+');
  const taskWithoutEmptyspaces = task.replace(/\s/g, '+');
  const requestString = `/ssot/getVariablesForNewTask/?botId=${robotId}&activityId=${activityId}&application=${applicationWithoutEmptyspaces}&task=${taskWithoutEmptyspaces}`;
  
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Fetch all variables for an existing activity
 * @param {String} robotId - String including the Id of the robot
 * @param {String} activityId - String including the Id of the activity
 */
const checkBotForExistingVariables = async (
  robotId,
  activityId) => {
  const requestString = `/ssot/checkForExistingVariables/?botId=${robotId}&activityId=${activityId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Will update the variables for the specified activity
 * @param {String} robotId - String including the Id of the robbot
 * @param {String} activityId - String including the Id of the activity
 * @param {Array} newVariableList - Array of the variables which will be used to update the SSOT
 */
const updateVariablesForRobot = async (
  robotId,
  activityId,
  newVariableList,
  outputVariableName) => {
  const requestString = `/ssot/updateVariables/?botId=${robotId}&activityId=${activityId}`;
  const updateObject = {
    parameters: newVariableList,
    output: outputVariableName
  };
  const response = await fetch(requestString, {
    body: JSON.stringify(updateObject),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  return response;
};

export {
  variablesForNewTask,
  checkBotForExistingVariables,
  updateVariablesForRobot
};
