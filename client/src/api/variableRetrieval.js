/**
 * @category Client
 * @module
 */

/**
 * @description Will update the variables for the specified activity
 * @param {String} robotId - String including the Id of the robbot
 * @param {String} activityId - String including the Id of the activity
 * @param {Array} newVariableList - Array of the variables which will be used to update the ssot
 */
const updateVariablesForRobot = async (
  robotId,
  activityId,
  newVariableList,
  outputVariableName
) => {
  const requestString = `/ssot/updateVariables/?robotId=${robotId}&activityId=${activityId}`;
  const updateObject = {
    parameters: newVariableList,
    output: outputVariableName,
  };
  const response = await fetch(requestString, {
    body: JSON.stringify(updateObject),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  return response;
};

// eslint-disable-next-line import/prefer-default-export
export { updateVariablesForRobot };
