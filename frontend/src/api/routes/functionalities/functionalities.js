/**
 * @category Frontend
 * @module
 */

/**
 * @description Fetch tasklist from Mongo-DB
 * @param {String} application - String with currently selected application from ApplicationDropdown
 * @returns {Array} Array of all task for the given application
 */
const fetchTasksFromDB = async (application) => {
  const response = await fetch(`/functionalities/${application}/tasks`);
  return response;
};

/**
 * @description Fetch all applications from MongoDB
 * @returns {Array} Array of all available applications
 */
const getAvailableApplications = async () => {
  const response = await fetch('/functionalities/applications');
  return response;
};

/**
 * @description Will send a backend call to retrieve all rpa-task objects for the purpose of retrieving the related parameter and possible output value
 * @returns {Array} Array of all rpa-task objects
 */
const getAllRpaFunctionalities = async () => {
  const response = await fetch(`/functionalities`);
  return response;
};

export { getAvailableApplications, fetchTasksFromDB, getAllRpaFunctionalities };
