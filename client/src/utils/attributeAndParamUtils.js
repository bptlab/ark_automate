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
 * @description Will retrieve the value of the input variables name from either session storage, 
 * an existing object in the database or create a new one and will save it in local session storage
 * @param {String} robotId Id of the robot/ssot for which to retrieve the value
 * @param {String} activityId Id of the activity for which to retrieve the value for
 * @returns {Array} Array of the different parameter objects the activity has
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

        if (variableResponse.outputValue) responseObject.outputVariable = `${activityId  }_output`;

        let addedStorage = localStorage;
        addedStorage.push(responseObject);
        addedStorage = JSON.stringify(addedStorage);
        sessionStorage.setItem(PARAMETER_STORAGE_PATH, addedStorage);
        return responseObject.rpaParameters;
    }
};

/**
 * @description Will set the parameters in local session storage
 * @param {String} robotId Id of the robot/ssot for which to change the value
 * @param {String} activityId Id of the activity for which to change the value for
 * @param {String} newParameterObject The new parameter object
 */
const setParameter = (robotId, activityId, newParameterObject) => {
    let localStorage = sessionStorage.getItem(PARAMETER_STORAGE_PATH);
    localStorage = JSON.parse(localStorage);
    const matchingElement = localStorage.find((element) => (element.ssotId === robotId && element.activityId === activityId));
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
 * @description Will retrieve the value of the output variables name from either session storage, 
 * an existing object in the database or create a new one and will save it in local session storage
 * @param {String} robotId Id of the robot/ssot for which to retrieve the value
 * @param {String} activityId Id of the activity for which to retrieve the value for
 * @returns {String} The value for the name of the output variable
 */
const getOutputValue = async (robotId, activityId) => {
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

        if (variableResponse.outputValue) responseObject.outputVariable = `${activityId  }_output`;

        let addedStorage = localStorage;
        addedStorage.push(responseObject);
        addedStorage = JSON.stringify(addedStorage);
        sessionStorage.setItem(PARAMETER_STORAGE_PATH, addedStorage);
        return responseObject.outputVariable;
    }
};

/**
 * @description Will set the new value as the name of the output variable in local session storage
 * @param {String} robotId Id of the robot/ssot for which to change the value
 * @param {String} activityId Id of the activity for which to change the value for
 * @param {String} newValueName The new value for the name of the output variable
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

/**
 * TODO
 */
const upsert = async () => {
    const ssot = sessionStorage.getItem('ssotLocal');
    const requestStringSsot = `/ssot/overwriteRobot/${botId}`;
    const responseSsot = await fetch(requestStringSsot, {
        body: ssot,
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        }
    });
    console.log('ssot answer: ' + responseSsot);

    const attributes = sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH);
    const requestStringAttributes = `/ssot/updateManyAttributes`;
    const responseAttributes = await fetch(requestStringAttributes, {
        body: attributes,
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        }
    });
    console.log('attribute answer: ' + responseAttributes);

    const parameterObject = sessionStorage.getItem(PARAMETER_STORAGE_PATH);
    const requestStringParameters = `/ssot/updateManyParameters`;
    const responseParameters = await fetch(requestStringParameters, {
        body: parameterObject,
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        }
    });
    console.log('parameter answer: ' + responseParameters);
};

module.exports = {
    getAttributes,
    setRpaTask,
    setRpaApplication,
    getParameters,
    setParameter,
    getOutputValue,
    setOutputValue,
    upsert
}