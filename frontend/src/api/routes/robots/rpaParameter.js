/**
 * @category Frontend
 * @module
 */

/**
 * @description Fetch all parameter objects for a specifc robot
 * @param { String } robotId Id of the robot we want to get all the parameters for
 */
const getAllParametersForRobot = async (robotId) => {
  const requestString = `/robots/parameters/${robotId}`;
  const response = await fetch(requestString);
  return response;
};

/**
 * @description Will send a backend call to update all given parameter objects with the new one's
 * @param {Array} parameterObjectsList All updated parameters objects to overwrite the old attribute objects with
 * @returns {Array} Array of all updated parameter objects
 */
const updateManyParameters = async (parameterObjectsList) => {
  const requestStringParameters = `/robots/parameters`;
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
 * @description Sends a callout to the backend to delete parameters for the given activities
 * @param {String} robotId Id of the robot that is being used
 * @param {String} unusedActivityListString Stringified List of Activity Ids
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
