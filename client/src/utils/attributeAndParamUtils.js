/**
 * @category Client
 * @module
 */

/**
 * appTaskLocalStorage
 */



/**
 * TODO
 */
 const findMatchingActivity = (robotId, activityId) => {
    
};

/**
 * TODO
 */
const getAttributes = async (robotId, activityId) => {
    const localStorage = sessionStorage.getItem('appTaskLocalStorage');
    const matchingActivity = localStorage.find( (element) => (element.ssotId === robotId && element.activityId === activityId));

    if (matchingActivity) {
        return matchingActivity;
    } 

    const requestString = `/ssot/getAttributes?botId=${robotId}&activityId=${activityId}`;
    const response = await fetch(requestString);
    const attributeObject = {
        activityId,
        ssotId:robotId,
        rpaApplication: response.rpaApplication,
        rpaTask: response.rpaTask
    }
    const addedStorage = localStorage;
    addedStorage.push(attributeObject);
    sessionStorage.setItem('appTaskLocalStorage', addedStorage);
    return attributeObject;
};

/**
 * TODO
 */
const setRpaTask = (robotId, activityId, newTask) => {
    const localStorage = sessionStorage.getItem('appTaskLocalStorage');
    const matchingActivity = localStorage.find( (element) => (element.ssotId === robotId && element.activityId === activityId));
    const arrayWithoutMatchingElement = localStorage.filter( (element) => element.ssotId !== robotId && element.activityId !== activityId);

    matchingActivity.rpaTask = newTask;

    arrayWithoutMatchingElement.push(matchingActivity);
    sessionStorage.setItem('appTaskLocalStorage', arrayWithoutMatchingElement);
};

/**
 * TODO
 */
const setRpaApplication = (robotId, activityId, newApplication) => {
    const localStorage = sessionStorage.getItem('appTaskLocalStorage');
    const matchingActivity = localStorage.find( (element) => (element.ssotId === robotId && element.activityId === activityId));
    const arrayWithoutMatchingElement = localStorage.filter( (element) => element.ssotId !== robotId && element.activityId !== activityId);

    matchingActivity.rpaApplication = newApplication;

    arrayWithoutMatchingElement.push(matchingActivity);
    sessionStorage.setItem('appTaskLocalStorage', arrayWithoutMatchingElement);
    
};

/**
 * TODO
 */
const getParameters = (robotId, activityId) => {
    
};

/**
 * TODO
 */
const setParameter = (robotId, activityId, newParameterObject) => {
    
};

/**
 * TODO
 */
const getOutputValue = (robotId, activityId) => {
    
};

/**
 * TODO
 */
const setOutputValue = (robotId, activityId, newValueName) => {
    
};
  
module.exports = {
    getAttributes,
    setRpaTask,
    setRpaApplication,
    getParameters,
    setParameter,
    getOutputValue,
    setOutputValue
}