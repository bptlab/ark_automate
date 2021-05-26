/**
 * @category Frontend
 * @module
 */

/**
 * @description Fetch all parameter objects for a specifc robot
 * @param { String } robotId Id of the robot to get all the parameters for
 * @returns {Array} All objects that have been found for the robot
 */
const getAllParametersForRobot = async (robotId) => {
  const requestString = `/robots/parameters/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Will send a backend call to update all given parameter objects with the new ones
 * @param {Array} parameterObjectsList All updated parameters objects to overwrite the old attribute objects with
 * @returns {Array} Array of all updated parameter objects
 */
const updateManyParameters = async (parameterObjectsList) => {
  const requestStringParameters = `/robots/parameters`;
  // eslint-disable-next-line no-unused-vars
  const response = await fetch(requestStringParameters, {
    body: JSON.stringify({ parameterObjectsList }),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  return response;
};

/**
 * @description Delete parameters for the given activities by sending a call to the backend
 * @param {String} robotId Id of the robot that will be used
 * @param {String} unusedActivityListString Stringified List of activityIds
 * @returns {Object} Mongoose query describing execution of call
 */
const deleteParametersForActivities = (robotId, activityIdList) => {
  const requestStringParameters = `/robots/parameters/${robotId}`;
  fetch(requestStringParameters, {
    body: JSON.stringify({ activityIdList }),
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }).catch((err) => {
    console.error(err);
  });
};

export {
  getAllParametersForRobot,
  updateManyParameters,
  deleteParametersForActivities,
};
