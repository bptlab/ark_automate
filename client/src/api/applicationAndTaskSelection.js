/**
 * @category Client
 * @module
 */

/**
 * @description Fetch tasklist from Mongo-DB
 * @param {String} application - String with currently selected application from ApplicationDropdown
 */
const fetchTasksFromDB = async (application) => {
  const response = await fetch(`/functionalities/${application}/tasks`);
  return response;
};

/**
 * @description Fetch all applications from MongoDB
 */
const getAvailableApplications = async () => {
  const response = await fetch('/functionalities/applications');
  return response;
};

/**
 * @description Will send a backend call to retrieve all rpa-task objects for the purpose of retrieving the related parameter and possibly output value
 * @returns {Array} Array of all rpa-task objects
 */
const getAllRpaFunctionalities = async () => {
  const response = await fetch(`/functionalities`);
  return response;
};

export { getAvailableApplications, fetchTasksFromDB, getAllRpaFunctionalities };
