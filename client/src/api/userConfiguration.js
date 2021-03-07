/**
 * @category Client
 * @module
 */

/**
 * @description Get the current user id
 */
const getCurrentUserId = async () => {
  const response = await fetch(`user/config/get-current-id`);
  return response.json();
};

/**
 * @description Set the current user id
 * @param {String} value - current user id value
 */
const setCurrentUserId = async (value) => {
  const response = await fetch(`user/config/set-current-id?userId=${value}`);
  return response.json();
};

export { getCurrentUserId, setCurrentUserId };
