/**
 * @category Client
 * @module
 */

/**
 * @description Will get the object for an specific rpa application and rpa task combination
 * @param {String} application Name of the rpa application
 * @param {String} task Name of the rpa task
 */
const getRpaFunctionalitiesObject = (application, task) => {
  const localComboStorage = JSON.parse(
    sessionStorage.getItem('TaskApplicationCombinations')
  );
  return localComboStorage.find(
    (element) => element.Application === application && element.Task === task
  );
};

export default getRpaFunctionalitiesObject;
