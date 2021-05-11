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

export { getAvailableApplications, fetchTasksFromDB };
