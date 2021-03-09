/**
 * @category Client
 * @module
 */

/**
 * @description Checks if passed item already exists in session storage and initializes with given value if not existing.
 * @param {*} itemToCheckFor The selected item to check for in the session storage.
 * @param {*} valueToInitTo The value to init to if the item is not existing in session storage yet.
 */
const initSessionStorage = (itemToCheckFor, valueToInitTo) => {
  if (sessionStorage.getItem(itemToCheckFor) === null)
    sessionStorage.setItem(itemToCheckFor, valueToInitTo);
};

export default initSessionStorage;
