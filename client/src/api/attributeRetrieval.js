/**
 * @category Client
 * @module
 */

/**
 * @description Will send a backend call to retrieve all attribute objects related to the provided robotId
 * @param {String} robotId Id of the robot for which to retrieve the values
 * @returns {Array} Array of attribute objects related to the robot
 */
const getAllAttributes = async (robotId) => {
  const response = await fetch(`/robots/rpaattributes/${robotId}`);
  return response;
};

/**
 * @description Will send a backend call to update all given attribute objects with the new one's
 * @param {Array} attributeObjectList All updated attribute objects to overwrite the old attribute objects with
 */
const updateManyAttributes = async (attributeObjectList) => {
  const requestStringAttributes = `/robots/rpaattributes`;
  // eslint-disable-next-line no-unused-vars
  const response = await fetch(requestStringAttributes, {
    body: JSON.stringify({ attributeObjectList }),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  return response;
};

export { getAllAttributes, updateManyAttributes };
