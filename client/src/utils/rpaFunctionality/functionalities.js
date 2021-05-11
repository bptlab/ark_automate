/**
 * @category Client
 * @module
 */

const FUNCTIONALITIES_STORAGE_PATH = 'TaskApplicationCombinations';

/**
 * @description Will get the rpa functionalities object for a specific rpa application and rpa task combination
 * @param {String} application Name of the rpa application
 * @param {String} task Name of the rpa task
 */
const getRpaFunctionalitiesObject = (application, task) => {
  const rpaFunctionalities = JSON.parse(
    sessionStorage.getItem(FUNCTIONALITIES_STORAGE_PATH)
  );
  return rpaFunctionalities.find(
    (element) => element.Application === application && element.Task === task
  );
};

export default getRpaFunctionalitiesObject;
