import { getAvailableApplications } from '../../api/applicationAndTaskSelection';

/**
 * @description Checks if passed item already exists in session storage and initializes with given value if not existing.
 * @param {String} itemToCheckFor The selected item to check for in the session storage.
 * @param {String} valueToInitTo The value to init to if the item is not existing in session storage yet.
 */
const initSessionStorage = (itemToCheckFor, valueToInitTo) => {
  if (sessionStorage.getItem(itemToCheckFor) === null)
    sessionStorage.setItem(itemToCheckFor, valueToInitTo);
};

const initAvailableApplicationsSessionStorage = () => {
  initSessionStorage('availableApplications', JSON.stringify([]));
  let applicationList = sessionStorage.getItem('availableApplications');
  applicationList = JSON.parse(applicationList);
  if (applicationList && applicationList.length < 1)
    getAvailableApplications()
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('availableApplications', JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
      });
};

export { initAvailableApplicationsSessionStorage, initSessionStorage };
