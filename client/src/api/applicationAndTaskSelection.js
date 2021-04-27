/**
 * @category Client
 * @module
 */

/**
 * @description Fetch tasklist from Mongo-DB
 * @param {String} application - String with currently selected application from ApplicationDropdown
 */
const fetchTasksFromDB = async (application) => {
  const response = await fetch(
    `/rpa-framework/commands/get-available-tasks-for-application?application=${application.replaceAll(
      ' ',
      '+'
    )}`
  );
  return response;
};

/**
 * @description Fetch all applications from MongoDB
 */
const getAvailableApplications = async () => {
  const response = await fetch(
    '/rpa-framework/commands/get-available-applications'
  );
  return response;
};

export { getAvailableApplications, fetchTasksFromDB };
