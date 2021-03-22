/**
 * @category Client
 * @module
 */

/**
 * appTaskLocalStorage
 */

const APPLICATION_TASK_STORAGE_PATH = 'appTaskLocalStorage';
const PARAMETER_STORAGE_PATH = 'parameterLocalStorage';

/**
 * TODO
 */
const getAttributes = async (robotId, activityId) => {
    const localStorage = sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH);
    localStorage = JSON.parse(localStorage);
    const matchingActivity = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));

    if (matchingActivity) {
        return matchingActivity;
    }

    const requestString = `/ssot/getAttributes?botId=${robotId}&activityId=${activityId}`;
    const response = await fetch(requestString);
    let addedStorage = localStorage;

    addedStorage.push(response);
    addedStorage = JSON.stringify(addedStorage);
    sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, addedStorage);
    return response;
};

/**
 * TODO
 */
const setRpaTask = (robotId, activityId, newTask) => {
    let localStorage = sessionStorage.getItem('appTaskLocalStorage');
    localStorage = JSON.parse(localStorage);
    const matchingActivity = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));
    let arrayWithoutMatchingElement = localStorage.filter((element) => element.ssotId !== robotId && element.activityId !== activityId);

    matchingActivity.rpaTask = newTask;

    arrayWithoutMatchingElement.push(matchingActivity);
    arrayWithoutMatchingElement = JSON.stringify(arrayWithoutMatchingElement);
    sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, arrayWithoutMatchingElement);
};

/**
 * TODO
 */
const setRpaApplication = async (robotId, activityId, newApplication) => {
    let localStorage = sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH);
    localStorage = JSON.parse(localStorage);
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
    arrayWithoutMatchingElement = JSON.stringify(arrayWithoutMatchingElement);
    sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, arrayWithoutMatchingElement);
};

/**
 * TODO
 */
const getParameters = async (robotId, activityId) => {
    let localStorage = sessionStorage.getItem(PARAMETER_STORAGE_PATH);
    localStorage = JSON.parse(localStorage);
    const matchingParameterObject = localStorage.find( (element) => (element.ssotId === robotId && element.activityId === activityId));

    if (matchingParameterObject.rpaParameters) {
        return matchingParameterObject.rpaParameters;
    } 

    const requestString = `/ssot/getVariables?botId=${robotId}&activityId=${activityId}`;
    const response = await fetch(requestString);
    if (response && response.rpaParameters) {
        let addedStorage = localStorage;
        addedStorage.push(response);
        addedStorage = JSON.stringify(addedStorage);
        sessionStorage.setItem(PARAMETER_STORAGE_PATH, addedStorage);
        return response.rpaParameters;
    }

    const attributes = await getAttributes(robotId, activityId);
    const variableReqString = `/ssot/getVariablesForTaskApplication?task=${attributes.task}&application=${attributes.rpaApplication}`;
    const variableResponse = await fetch(variableReqString);
    if (variableResponse) {
        const responseObject = {
            rpaParameters: [],
            ssotId: robotId,
            activityId
        };
        responseObject.rpaParameters = [];
        variableResponse.inputVars.forEach((element) => {
            let elementCopy = element;
            elementCopy.value = '';
            responseObject.rpaParameters.push(elementCopy);
        });

        if (variableResponse.outputValue) responseObject.outputVariable = activityId + '_output';

        let addedStorage = localStorage;
        addedStorage.push(responseObject);
        addedStorage = JSON.stringify(addedStorage);
        sessionStorage.setItem(PARAMETER_STORAGE_PATH, addedStorage);
        return responseObject.rpaParameters;
    }
};

/**
 * TODO
 */
const setParameter = (robotId, activityId, newParameterObject) => {
    let localStorage = sessionStorage.getItem(PARAMETER_STORAGE_PATH);
    localStorage = JSON.parse(localStorage);
    let matchingElement = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));
    let arrayWithoutMatchingElement = localStorage.filter((element) => element.ssotId !== robotId && element.activityId !== activityId);

    if (matchingElement) {
        const parametersWithoutMatch = matchingElement.rpaParameters.filter((element) => (
            element.name !== newParameterObject.name && 
            element.type !== newParameterObject.type &&
            element.index !== newParameterObject.index
        ));
        parametersWithoutMatch.push(newParameterObject);
    } else {
        alert('There has been an error setting the parameter!');
    }
    matchingElement.rpaParameters = parametersWithoutMatch;
    arrayWithoutMatchingElement.push(matchingElement);
    arrayWithoutMatchingElement = JSON.stringify(arrayWithoutMatchingElement);
    sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, arrayWithoutMatchingElement);
};

/**
 * TODO
 */
const getOutputValue = (robotId, activityId) => {
    let localStorage = sessionStorage.getItem(PARAMETER_STORAGE_PATH);
    localStorage = JSON.parse(localStorage);
    const matchingParameterObject = localStorage.find( (element) => (element.ssotId === robotId && element.activityId === activityId));

    if (matchingParameterObject.outputVariable) {
        return matchingParameterObject.outputVariable;
    } 

    const requestString = `/ssot/getVariables?botId=${robotId}&activityId=${activityId}`;
    const response = await fetch(requestString);

    if (response && response.outputVariable) {
        let addedStorage = localStorage;
        addedStorage.push(response);
        addedStorage = JSON.stringify(addedStorage);
        sessionStorage.setItem(PARAMETER_STORAGE_PATH, addedStorage);
        return response.outputVariable;
    }

    const attributes = await getAttributes(robotId, activityId);
    const variableReqString = `/ssot/getVariablesForTaskApplication?task=${attributes.task}&application=${attributes.rpaApplication}`;
    const variableResponse = await fetch(variableReqString);
    if (variableResponse) {
        const responseObject = {
            rpaParameters: [],
            ssotId: robotId,
            activityId
        };
        responseObject.rpaParameters = [];
        variableResponse.inputVars.forEach((element) => {
            let elementCopy = element;
            elementCopy.value = '';
            responseObject.rpaParameters.push(elementCopy);
        });

        if (variableResponse.outputValue) responseObject.outputVariable = activityId + '_output';

        let addedStorage = localStorage;
        addedStorage.push(responseObject);
        addedStorage = JSON.stringify(addedStorage);
        sessionStorage.setItem(PARAMETER_STORAGE_PATH, addedStorage);
        return responseObject.outputVariable;
    }
};

/**
 * TODO
 */
const setOutputValue = (robotId, activityId, newValueName) => {
    let localStorage = sessionStorage.getItem(PARAMETER_STORAGE_PATH);
    localStorage = JSON.parse(localStorage);
    let matchingElement = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));
    let arrayWithoutMatchingElement = localStorage.filter((element) => element.ssotId !== robotId && element.activityId !== activityId);

    if (matchingElement) {
        matchingElement.outputVariable = newValueName;
    } else {
        alert('There has been an error setting the output variable name!');
    }

    arrayWithoutMatchingElement.push(matchingElement);
    arrayWithoutMatchingElement = JSON.stringify(arrayWithoutMatchingElement);
    sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, arrayWithoutMatchingElement);
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