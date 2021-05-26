/**
 * @category Frontend
 * @module
 */

/**
 * @description Checks if the passed item already exists in the session storage and initializes it with given value if not existing.
 * @param {String} itemToCheckFor The selected item in the session storage that will be checked
 * @param {String} valueToInitTo The value to initialize to if the item is not existing in session storage yet.
 */
const initSessionStorage = (itemToCheckFor, valueToInitTo) => {
  if (sessionStorage.getItem(itemToCheckFor) === null)
    sessionStorage.setItem(itemToCheckFor, valueToInitTo);
};

const initAvailableApplicationsSessionStorage = () => {
  initSessionStorage('availableApplications', JSON.stringify([]));
  const taskAndApplicationCombinations = JSON.parse(
    sessionStorage.getItem('taskApplicationCombinations')
  );
  const allApplications = taskAndApplicationCombinations.map(
    (singleCombination) => singleCombination.Application
  );
  const applicationsWithoutDuplicates = allApplications.filter(
    (singleApplication, index, self) =>
      self.indexOf(singleApplication) === index
  );

  sessionStorage.setItem(
    'availableApplications',
    JSON.stringify(applicationsWithoutDuplicates)
  );
};

export { initAvailableApplicationsSessionStorage, initSessionStorage };
