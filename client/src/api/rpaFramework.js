/**
 * @description Fetch tasklist from Mongo-DB
 * @param {String} selectedApplication - String with currently selected application from Dropdown
 */
const fetchTasksFromDB = async (selectedApplication) => {
  let result = await fetch(
    '/rpa-framework/commands/get-available-tasks-for-application?application=' +
      selectedApplication.replaceAll(' ', '+')
  );
  return result;
};

/**
 * @description Fetch all applications from MongoDB
 */
const getAvailableApplications = async () => {
  let result = await fetch(
    '/rpa-framework/commands/get-available-applications'
  );
  return result;
};

module.exports = {
  fetchTasksFromDB,
  getAvailableApplications,
};
