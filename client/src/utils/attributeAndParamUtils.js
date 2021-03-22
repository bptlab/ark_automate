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
    let localStorage = sessionStorage.getItem('appTaskLocalStorage');
    localStorage = await JSON.parse(localStorage)
    const matchingActivity = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));

    if (matchingActivity) {
        return matchingActivity;
    }

    const requestString = `/ssot/getAttributes?botId=${robotId}&activityId=${activityId}`;
    const response = await fetch(requestString);
    const attributeObject = {
        activityId,
        ssotId: robotId,
        rpaApplication: response.rpaApplication,
        rpaTask: response.rpaTask
    }
    let addedStorage = localStorage;

    addedStorage.push(attributeObject);
    addedStorage = await JSON.stringify(addedStorage)
    sessionStorage.setItem('appTaskLocalStorage', addedStorage);
    return attributeObject;
};

/**
 * TODO
 */
const setRpaTask = (robotId, activityId, newTask) => {
    const localStorage = sessionStorage.getItem('appTaskLocalStorage');
    const matchingActivity = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));
    const arrayWithoutMatchingElement = localStorage.filter((element) => element.ssotId !== robotId && element.activityId !== activityId);

    matchingActivity.rpaTask = newTask;

    arrayWithoutMatchingElement.push(matchingActivity);
    sessionStorage.setItem('appTaskLocalStorage', arrayWithoutMatchingElement);
};

/**
 * TODO
 */
const setRpaApplication = async (robotId, activityId, newApplication) => {
    let localStorage = sessionStorage.getItem('appTaskLocalStorage');
    localStorage = JSON.parse(localStorage)
    let matchingActivity = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));
    let arrayWithoutMatchingElement = localStorage.filter((element) => element.ssotId !== robotId && element.activityId !== activityId);

    if (matchingActivity) {
        matchingActivity.rpaApplication = newApplication;
    } else {
        matchingActivity = {
            activityId,
            ssotId: robotId,
            rpaApplication: newApplication,
        };
    }

    arrayWithoutMatchingElement.push(matchingActivity);
    arrayWithoutMatchingElement = JSON.stringify(arrayWithoutMatchingElement)
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