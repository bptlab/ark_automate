/**
 * @category Client
 * @module
 */

/**
 * appTaskLocalStorage
 */

const ROBOT_ID_PATH = 'robotId';
const APPLICATION_TASK_STORAGE_PATH = 'attributeLocalStorage';
const PARAMETER_STORAGE_PATH = 'parameterLocalStorage';

/**
 * @description this function returns the robotId of the currently opened robot from the session storage
 * @returns currently saved robotId from session storage
 */
const getRobotId = () => JSON.parse(sessionStorage.getItem(ROBOT_ID_PATH));

/**
 * @description this function writes the robotId of the currently opened robot to the session storage
 * @param {String} robotId the robotId ot the currently opened robot
 */
const setRobotId = (robotId) => {
    sessionStorage.setItem(ROBOT_ID_PATH, JSON.stringify(robotId));
};

/**
 * @description Retireves or creates a new attribute object for the given activity and will set the task to undefined.
 * Use this function to reset the associated task for that activity.
 * @param {string} robotId id of the currently opened robot
 * @param {string} activityId id of the currently selected activity
 * @param {string} newApplication name of the selected application from dropdown
 */
const resetRpaApplication = (robotId, activityId, newApplication) => {
    const localApplicationTaskStorage = JSON.parse(sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH));

    let matchingActivity = localApplicationTaskStorage.find((element) => (element.activityId === activityId));
    const arrayWithoutMatchingElement = localApplicationTaskStorage.filter((element) => element.ssotId === robotId && element.activityId !== activityId);

    if (matchingActivity) {
        matchingActivity.rpaApplication = newApplication;
    } else {
        matchingActivity = {
            activityId,
            ssotId: robotId,
            rpaApplication: newApplication
        };
    }

    matchingActivity.rpaTask = undefined;
    arrayWithoutMatchingElement.push(matchingActivity);
    sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, JSON.stringify(arrayWithoutMatchingElement));
};

/**
 * @description stores the RPA Task for the currently selected activity in the session storage
 * @param {string} robotId id of the currently opened robot
 * @param {string} activityId id of the currently selected activity
 * @param {string} application name of the selected application
 * @param {string} newTask name of the selected task from dropdown
 */
const setRpaTask = (robotId, activityId, application, newTask) => {
    const localApplicationTaskStorage = JSON.parse(sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH));

    let matchingActivity = localApplicationTaskStorage.find((element) => (element.activityId === activityId));
    const arrayWithoutMatchingElement = localApplicationTaskStorage.filter((element) => (
        element.ssotId === robotId &&
        element.activityId !== activityId
    ));

    if (matchingActivity) {
        matchingActivity.rpaTask = newTask;
    } else {
        matchingActivity = {
            activityId,
            ssotId: robotId,
            rpaApplication: application,
            rpaTask: newTask
        }
    }

    arrayWithoutMatchingElement.push(matchingActivity);
    sessionStorage.setItem(APPLICATION_TASK_STORAGE_PATH, JSON.stringify(arrayWithoutMatchingElement));
};

/**
 * @param {String} activityId id of the currently selected activity
 * @description this util function returns the RPA application for the selected activity
 * @returns the selected RPA application for the selected activity from localStorage
 */
const getRpaApplication = (activityId) => {
    const localApplicationTaskStorage = JSON.parse(sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH));
    const matchingEntry = localApplicationTaskStorage.find((element) => (element.activityId === activityId));

    let selectedApplication;
    if (matchingEntry) {
        selectedApplication = matchingEntry.rpaApplication;
    }
    return selectedApplication;
};

/**
 * 
 * @param {*} activityId id of the currently selected activity
 * @description this util function returns the activityId for the selected activity
 * @returns the selected RPA task for the selected activity from localStorage
 */
const getRpaTask = (activityId) => {
    const localApplicationTaskStorage = JSON.parse(sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH));
    const matchingEntry = localApplicationTaskStorage.find((element) => (element.activityId === activityId));

    let selectedTask;
    if (matchingEntry) {
        selectedTask = matchingEntry.rpaTask;
    }
    return selectedTask;
};

/** 
 * @description Will retrieve the value of the input variables name from either session storage, 
 * or create a new one and will save it in local session storage. 
 * If an existing prameter object has been found there will be a check happening, if the signature matches 
 * the one specified for that activities task and application. If not, then something must have been out of sync
 * and a new object will be created and saved to sessionStorage. 
 * @param {String} robotId Id of the robot/ssot for which to retrieve the value
 * @param {String} activityId Id of the activity for which to retrieve the value for
 * @returns {Object} The parameter object the activity has
 */
const getParameterObject = (robotId, activityId) => {
    let localParameterStorage = JSON.parse(sessionStorage.getItem('parameterLocalStorage'));
    let matchingParameterObject = localParameterStorage.find((element) => (element.activityId === activityId));

    if (matchingParameterObject) {
        const localAttributeStorage = JSON.parse(sessionStorage.getItem('attributeLocalStorage'));
        const matchingAttributeObject = localAttributeStorage.find((element) => (element.activityId === activityId));
        const application = matchingAttributeObject.rpaApplication;
        const task = matchingAttributeObject.rpaTask;

        const localComboStorage = JSON.parse(sessionStorage.getItem('TaskApplicationCombinations'));
        const matchingComboObject = localComboStorage.find((element) => (
            element.Application === application &&
            element.Task === task
        ));

        if (matchingComboObject) {
            // In the future there could be a need for a more advanced signature check, but fur the current use cases this should be sufficient
            const comboParameterLength = matchingComboObject.inputVars.length;
            const parameterObjectLength = matchingParameterObject.rpaParameters.length;
            const comboFirstParamInfoText = matchingComboObject.inputVars.find((element) => (element.index === 0)).infoText;
            const firstParamInfoText = matchingParameterObject.rpaParameters.find((element) => (element.index === 0)).infoText;

            if (comboParameterLength === parameterObjectLength && comboFirstParamInfoText === firstParamInfoText) {
                return matchingParameterObject;
            }
        }
    }

    localParameterStorage = localParameterStorage.filter((element) => element.activityId !== activityId);
    const localAttributeStorage = JSON.parse(sessionStorage.getItem('attributeLocalStorage'));

    const matchingAttributeObject = localAttributeStorage.find((element) => (element.activityId === activityId));
    const application = matchingAttributeObject.rpaApplication;
    const task = matchingAttributeObject.rpaTask;

    if (application && task) {
        const localComboStorage = JSON.parse(sessionStorage.getItem('TaskApplicationCombinations'));
        const matchingComboObject = localComboStorage.find((element) => (
            element.Application === application &&
            element.Task === task
        ));

        const rpaParameters = [];
        if (matchingComboObject) {
            matchingComboObject.inputVars.forEach((element) => {
                const elementCopy = element;
                elementCopy.value = '';
                rpaParameters.push(elementCopy);
            });
        }

        matchingParameterObject = {
            activityId,
            outputVariable: matchingComboObject && matchingComboObject.outputValue ? `${activityId}_output` : undefined,
            rpaParameters,
            ssotId: robotId,
        }

        localParameterStorage.push(matchingParameterObject);
        sessionStorage.setItem('parameterLocalStorage', JSON.stringify(localParameterStorage));
        return matchingParameterObject;
    }
};

/**
 * @description Will set the single parameter in local session storage
 * @param {String} activityId Id of the activity for which to change the value for
 * @param {Object} value The value object returned by the dropdown selection
 */
const setSingleParameter = (activityId, value) => {
    const localParameterStorage = JSON.parse(sessionStorage.getItem('parameterLocalStorage'));
    const matchingParameterObject = localParameterStorage.find((element) => (element.activityId === activityId));
    const localParametersWithoutMatch = localParameterStorage.filter((element) => element.activityId !== activityId);

    const matchingSingleParameter = matchingParameterObject.rpaParameters.find((element) => (element.name === value.target.placeholder));
    const singleParametersWithoutMatch = matchingParameterObject.rpaParameters.filter((element) => element.name !== value.target.placeholder);

    const editedPrameter = matchingSingleParameter;
    editedPrameter.value = value.target.value;
    singleParametersWithoutMatch.push(editedPrameter);

    const editedParameterObject = matchingParameterObject;
    editedParameterObject.rpaParameters = singleParametersWithoutMatch;
    localParametersWithoutMatch.push(editedParameterObject);

    sessionStorage.setItem('parameterLocalStorage', JSON.stringify(localParametersWithoutMatch));
};

/**
 * @description Will send a backend call to retrieve all attribute objects related to the provided robotId
 * @param {String} robotId Id of the robot for which to retrieve the values
 * @returns {Array} Array of attribute objects related to the robot
 */
const getAttributesFromDB = async (robotId) => {
    const reqString = `/ssot/getAllAttributes/${robotId}`;
    const response = await fetch(reqString);
    return response;
};

/**
 * @description Will send a backend call to retrieve all rpa-task objects for the purpose of retrieving the related parameter and possibly output value
 * @returns {Array} Array of all rpa-task objects
 */
const getParameterFromDB = async () => {
    const reqString = `/rpa-framework/commands/getAllParameters`;
    const response = await fetch(reqString);
    return response;
};


/**
 * @description Will set the new value as the name of the output variable in local session storage
 * @param {String} robotId Id of the robot/ssot for which to change the value
 * @param {String} activityId Id of the activity for which to change the value for
 * @param {String} newValueName The new value for the name of the output variable
 */
const setOutputValueName = (activityId, value) => {
    const localParameterStorage = JSON.parse(sessionStorage.getItem('parameterLocalStorage'));
    const matchingParameterObject = localParameterStorage.find((element) => (element.activityId === activityId));
    const localParametersWithoutMatch = localParameterStorage.filter((element) => element.activityId !== activityId);

    const editedParameterObject = matchingParameterObject;
    editedParameterObject.outputVariable = value;
    localParametersWithoutMatch.push(editedParameterObject);

    sessionStorage.setItem('parameterLocalStorage', JSON.stringify(localParametersWithoutMatch));
};

/**
 * @description Will send three backend calls to upsert the ssot, the attribute objects and the parameter objects to the database.
 * The objects are taken from the session storage, so no parameters are required
 */
const upsert = async () => {
    const ssot = sessionStorage.getItem('ssotLocal');
    const robotId = JSON.parse(sessionStorage.getItem(ROBOT_ID_PATH));
    const requestStringSsot = `/ssot/overwriteRobot/${robotId}`;
    // eslint-disable-next-line no-unused-vars
    const responseSsot = await fetch(requestStringSsot, {
        body: ssot,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    const attributes = sessionStorage.getItem(APPLICATION_TASK_STORAGE_PATH);
    const requestStringAttributes = `/ssot/updateManyAttributes`;
    // eslint-disable-next-line no-unused-vars
    const responseAttributes = await fetch(requestStringAttributes, {
        body: attributes,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    const parameterObject = sessionStorage.getItem(PARAMETER_STORAGE_PATH);
    const requestStringParameters = `/ssot/updateManyParameters`;
    // eslint-disable-next-line no-unused-vars
    const responseParameters = await fetch(requestStringParameters, {
        body: parameterObject,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
};

/**
 * @description Will send a backend call to retrieve all parameter objects related to the provided robotId
 * @param {String} robotId Id of the robot for which to retrieve the values
 * @returns {Array} Array of parameter objects related to the robot
 */
const getParameterForRobotFromDB = async (robotId) => {
    const reqString = `/ssot/getAllParameters/${robotId}`;
    const response = await fetch(reqString);
    return response;
};

module.exports = {
    getRobotId,
    getRpaTask,
    setRobotId,
    setRpaTask,
    resetRpaApplication,
    getParameterObject,
    setSingleParameter,
    getAttributesFromDB,
    getParameterFromDB,
    setOutputValueName,
    getRpaApplication,
    upsert,
    getParameterForRobotFromDB
}
