/**
 * @category Client
 * @module
 */

/**
* @description Will retrieve the needed variables for a new application/task tuple and return that, as well as updating the SSOTwith those new variables
* @param {String} botId - String including the Id of the bot
* @param {String} activityId - String including the Id of the activity
* @param {String} application - String including the application
* @param {String} task - String including the task
*/
const variablesForNewTask = async (
  botId,
  activityId,
  application,
  task
) => {
  const applicationWithoutEmptyspaces = application.replace(/\s/g, '+');
  const taskWithoutEmptyspaces = task.replace(/\s/g, '+');
  const requestString = `/ssot/getVariablesForNewTask/?botId=${botId}&activityId=${activityId}&application=${applicationWithoutEmptyspaces}&task=${taskWithoutEmptyspaces}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Fetch all variables for an existing activity
 * @param {String} botId - String including the Id of the bot
 * @param {String} activityId - String including the Id of the activity
 */
const checkBotForExistingVariables = async (
  botId,
  activityId) => {
  const requestString = `/ssot/checkForExistingVariables/?botId=${botId}&activityId=${activityId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Will update the variables for the specified activity
 * @param {String} botId - String including the Id of the bot
 * @param {String} activityId - String including the Id of the activity
 * @param {Array} newVariableList - Array of the variables which will be used to update the SSOT
 */
const updateVariablesForBot = async (
  botId,
  activityId,
  newVariableList) => {
  const requestString = `/ssot/updateVariables/?botId=${botId}&activityId=${activityId}`;
  const response = await fetch(requestString, {
    body: JSON.stringify(newVariableList),
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
  updateVariablesForBot
};
