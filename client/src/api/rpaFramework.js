/**
 * @description Fetch tasklist from Mongo-DB and set state to force rerendering.
 * @param {String} selectedApplication - String with currently selected application from Dropdown
 * @param {Object} currentSavedTasksObject - Object with all applications and tasks as attributes
 */
const fetchTasksFromDB = async (
  selectedApplication,
  currentSavedTasksObject
) => {
  let result = await fetch(
    '/rpa-framework/commands/get-available-tasks-for-application?application=' +
      selectedApplication.replaceAll(' ', '+')
  );
  return result;
};

/**
 * @description Fetch all applications from MongoDB and save in session storage.
 */
const saveAvailableApplicationsToSessionStorage = async () => {
  let result = await fetch(
    '/rpa-framework/commands/get-available-applications'
  );
  return result;
};

module.exports = {
  fetchTasksFromDB,
  saveAvailableApplicationsToSessionStorage,
};
