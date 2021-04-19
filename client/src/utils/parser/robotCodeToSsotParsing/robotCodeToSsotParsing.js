/* eslint-disable no-alert */

/**
 * @category Client
 * @module
 */

const FOURSPACE = '    ';


/**
 * 
 * @returns "uniqueId" which is just an increment from the counter in the local storage 
 */
const getUniqueId = () => {
    const newId = JSON.parse(sessionStorage.getItem('idCounter')) + 1;
    sessionStorage.setItem('idCounter', newId);
    return newId;
}

/**
 * #todo
 * @returns 
 */
const getActivityId = () => `Activity_0ay${getUniqueId()}`
const getEventId = () => `Event_0ay${getUniqueId()}`


/**
 * @description Splits the robot code into an array and deletes all empty lines 
 * @param {String} robotCode Code from the Code editor
 * @returns Robot code w/o empty lines as an array
 */
const getRobotCodeAsArray = (robotCode) => {
    const robotCodeAsArray = robotCode.split('\n');
    for (let i = 0; i < robotCodeAsArray.length; i += 1) {
        if (robotCodeAsArray[i] === '') {
            robotCodeAsArray.splice(i, 1);
            i -= 1;
        }
    }
    return robotCodeAsArray;
}

/**
 * @description checks all lines of the settings section for the right syntax and returns all declared applications as an array
 * @param {Array} robotCodeSettingsSection all lines from the settings section as an array-entry (typeof string)
 * @returns Array of all declared applications or undefined if an error occures
 */
const getApplicationArray = (robotCodeSettingsSection) => {
    if (typeof robotCodeSettingsSection === 'undefined') return undefined;
    const robotCode = robotCodeSettingsSection.slice(1)
    const availableApplications = JSON.parse(sessionStorage.getItem('availableApplications'))
    let errorWasThrown;

    robotCode.forEach((line) => {
        const regexForRpaAlias = new RegExp(`Library +RPA[.][a-zA-Z]+`)

        const elementStartsWithLibary = line.startsWith('Library ');
        const rpaAliasIsCorrect = regexForRpaAlias.test(line);
        const applicationIsAvailable = availableApplications.includes(line.split('RPA.')[1])

        if (!elementStartsWithLibary) {
            alert(`Every line of the "*** Settings ***" Section has to start with "Library"! \nError location: "${line}"`);
            errorWasThrown = true;
            return;
        }
        if (!rpaAliasIsCorrect) {
            alert(`Application has to start with "RPA." \nError location: "${line}"`);
            errorWasThrown = true;
            return;
        }
        if (!applicationIsAvailable) {
            alert(`The Application "${String(line.split('RPA.')[1])}" is currently not supported. `);
            errorWasThrown = true;
        }
    })

    const declaredApplications = (errorWasThrown ? undefined : robotCode.map((line) => line.split('RPA.')[1]))

    return declaredApplications;
}

/**
 * @description retrieves the rpa task from the current code line
 * @param {String} currentLine current line of RPAf code
 * @param {String} splitPlaceholder placeholder to split the string
 * @returns rpaTask as String
 */
const getRpaTask = (currentLine, splitPlaceholder) => {
    const indexOfFirstSplitPlaceholder = currentLine.indexOf(splitPlaceholder);
    return currentLine.slice(0, indexOfFirstSplitPlaceholder);
}

/**
 * @description retrieves the rpa parameters from the current code line
 * @param {String} currentLine current line of RPAf code
 * @param {String} splitPlaceholder placeholder to split the string
 * @param {String} instructionBlocks current intruction block to get the rpaTask
 * @returns rpaParameters as Array
 */
const getRpaParameters = (currentLine, splitPlaceholder, instructionBlocks) => {
    const parametersWithoutRpaTask = currentLine.replace(instructionBlocks[instructionBlocks.length - 1].rpaTask + splitPlaceholder, '')
    return parametersWithoutRpaTask.split([splitPlaceholder]);
}

/**
 * @description "preprocesses" the code in a usable data format
 * @param {Array} robotCodeTaskSection robot code w/o empty lines as an array of Strings
 * @param {Array} declaredApplications all declared Aplications from ***settings*** section as Strings 
 * @returns Array of Objects with the following schema:
 *      instructionBlocks = [rpaApplication:String, rpaTask:String, name:String, paramArray:Array]
 */
const getInstructionBlocksFromTaskSection = (robotCodeTaskSection, declaredApplications) => {
    let currentApplication;
    let errorWasThrown;
    const instructionBlocks = [];
    const regexForElementNameLine = new RegExp(`#`)
    const splitPlaceholder = '§&§';

    robotCodeTaskSection.slice(1).forEach((line) => {
        if (errorWasThrown) return;
        let currentLine = line.trim();
        const currentLineDefinesNewApplication = declaredApplications.includes(currentLine);
        const currentLineContainsElementName = regexForElementNameLine.test(currentLine);
        const currentLineIncludesSplitPlaceholder = currentLine.includes(splitPlaceholder);
        const currentLineHasNoSpecifiedApplication = typeof currentApplication === 'undefined';

        if (currentLineDefinesNewApplication) {
            currentApplication = currentLine;
            return;

        } if (currentLineHasNoSpecifiedApplication) {
            alert(`There is no RPA-Application specified for line "${currentLine}"`);
            errorWasThrown = true;
            return;
        }

        if (currentLineIncludesSplitPlaceholder) {
            alert(`It is not allowed to use & or § as param values \nError location: "${line}"`);
            errorWasThrown = true;
            return;
        }

        if (currentLineContainsElementName) {
            instructionBlocks.push({ rpaApplication: currentApplication, name: currentLine.substring(1) })
            return;
        }

        if (!errorWasThrown) {
            currentLine = currentLine.replaceAll(FOURSPACE, splitPlaceholder);
            instructionBlocks[instructionBlocks.length - 1].rpaTask =
                getRpaTask(currentLine, splitPlaceholder);
            instructionBlocks[instructionBlocks.length - 1].paramArray =
                getRpaParameters(currentLine, splitPlaceholder, instructionBlocks);

            // TODO: implement parsing of outputVariables from RPAf code
        }
    })
    return (errorWasThrown ? undefined : instructionBlocks);
}

/**
 * @returns dummy startMarker as JSON => currently MARKERS aren't defined
 * in our RPAf-Syntax and therefore there aren't implemented
 */
const buildStartMarker = () => ({
    "successorIds": [],
    "id": getEventId(),
    "type": "MARKER",
    "name": "START",
    "predecessorIds": []
})

/**
 * @param {Object} predecessor as an Object to get the predecessorId
 * @returns dummy endMarker as JSON => currently MARKERS aren't defined
 * in our RPAf-Syntax and therefore there aren't implemented
 */
const buildEndMarker = (predecessor) => ({
    "successorIds": [],
    "id": getEventId(),
    "type": "MARKER",
    "name": "END",
    "predecessorIds": [predecessor ? predecessor.id : "MarkerElement"]
})

/**
 * @description builds the attributeObject for a single element
 * @param {Object} currentElement current instruction element
 * @param {Object} singleElementFromTasksSection the parsed Object from the RPAf Code  
 * @param {String} robotId the id of the current robot / ssot 
 * @returns attributeObject for a single attribute
 */
const buildSingleAttributeObject = (currentElement, singleElementFromTasksSection, robotId) => {
    let { rpaTask } = singleElementFromTasksSection;
    if (!rpaTask) rpaTask = 'no Task defined'

    return {
        activityId: currentElement.id,
        rpaApplication: singleElementFromTasksSection.rpaApplication,
        rpaTask,
        robotId
    }
}

/**
 * @description builds the parameterObject for a single element
 * @param {Object} singleAtrributeObject the attribute Object of the current activity
 * @param {Object} singleElementFromTasksSection the parsed Object from the RPAf Code   
 * @param {Array} taskAndApplicationCombinations all combinations of applications and tasks
 * @returns parameterObject for a single attribute
 */
const buildSingleParameterObject = (singleAtrributeObject, singleElementFromTasksSection, taskAndApplicationCombinations) => {
    const { rpaApplication, activityId, rpaTask, robotId } = singleAtrributeObject;
    const singleParamArray = singleElementFromTasksSection.paramArray;

    const combinationObject = taskAndApplicationCombinations.filter((singleCombinationObject) =>
        (singleCombinationObject.Application === rpaApplication && singleCombinationObject.Task === rpaTask)
    )[0];


    const parameterArray = combinationObject.inputVars.map((singleInputVariable, index) => {
        const singleParameterObject = {
            index: singleInputVariable.index,
            infoText: singleInputVariable.infoText,
            isRequired: singleInputVariable.isRequired,
            name: singleInputVariable.name,
            type: singleInputVariable.type,
            value: (singleParamArray[index].startsWith('%%') && singleParamArray[index].endsWith('%%') ? '' : singleParamArray[index]),
            requireUserInput: (!!(singleParamArray[index].startsWith('%%') && singleParamArray[index].endsWith('%%'))),
        };

        return singleParameterObject;
    })

    return {
        activityId,
        rpaParameters: parameterArray,
        robotId
    };
}

/**
 * @description build the elementsArray of the ssot
 * @param {Array} robotCodeTaskSection robot code w/o empty lines as an array of Strings
 * @param {Array} declaredApplications all declared Aplications from ***settings*** section as Strings 
 * @param {String} robotId the id of the current robot / ssot 
 * @returns elementsArray with all needed properties
 */
const getElementsArray = (robotCodeTaskSection, declaredApplications, robotId) => {
    const elementsArray = [];
    const attributeArray = [];
    const parameterArray = [];

    if (typeof robotCodeTaskSection === 'undefined' || typeof declaredApplications === 'undefined') return undefined;

    const taskAndApplicationCombinations = JSON.parse(sessionStorage.getItem('TaskApplicationCombinations'));
    const instructionArray = getInstructionBlocksFromTaskSection(robotCodeTaskSection, declaredApplications);
    if (typeof instructionArray === 'undefined') return undefined;

    elementsArray.push(buildStartMarker())

    instructionArray.forEach((singleElement) => {
        const currentElement = {}

        currentElement.successorIds = []
        currentElement.id = getActivityId();
        currentElement.type = 'INSTRUCTION';
        currentElement.name = singleElement.name;

        const predecessor = elementsArray[elementsArray.length - 1];
        currentElement.predecessorIds = predecessor && [predecessor.id];
        if (predecessor) predecessor.successorIds = [currentElement.id];

        elementsArray.push(currentElement);

        const singleAtrributeObject = buildSingleAttributeObject(currentElement, singleElement, robotId);
        attributeArray.push(singleAtrributeObject);

        const singleParameterObject = buildSingleParameterObject(singleAtrributeObject, singleElement, taskAndApplicationCombinations);
        parameterArray.push(singleParameterObject);
    })
    elementsArray.push(buildEndMarker(elementsArray[elementsArray.length - 1]))
    const lastElement = elementsArray[elementsArray.length - 1]
    const secontlLastElement = elementsArray[elementsArray.length - 2]
    secontlLastElement.successorIds = [lastElement.id]

    sessionStorage.removeItem('attributeLocalStorage')
    sessionStorage.setItem('attributeLocalStorage', JSON.stringify(attributeArray));
    sessionStorage.setItem('parameterLocalStorage', JSON.stringify(parameterArray));

    return elementsArray;
}

/**
 * @description retrieves the starterId of the robot from the elements array
 * @param {Array} elementsArray Array of all elements of the robot
 * @returns starterId as string
 */
const getStarterId = (elementsArray) =>
    elementsArray.forEach((singleElement) => {
        if (singleElement.type === 'MARKER' && singleElement.predecessorIds.length === 0) {
            return singleElement.id;
        }
        return 'noStarterElement';
    })
/**
 * @description
 * @param {Array} robotCodeAsArray the complete robotCode w/o new lines as array
 * @param {String} selector the selector to get the line number for
 * @returns line number where the selector occurs
 */
const getLineNumberForSelector = (robotCodeAsArray, selector) => {
    let lineNumber;
    robotCodeAsArray.forEach((codeLine, index) => {
        if (codeLine.trim().includes(selector)) lineNumber = index;
    });
    if (typeof lineNumber === 'undefined') alert(`The required selector "${selector}" was not found`)
    return lineNumber;
}

/**
 * @description Parses the RPA-Framework code from the code editor to the single source of truth
 * @param {String} robotCode from the code-editor
 * @returns Single source of truth as a JavaSctipt-object or undefined if an error occures
 */
const parseRobotCodeToSsot = (robotCode) => {

    const robotId = JSON.parse(sessionStorage.getItem('robotId'));
    const robotName = sessionStorage.getItem('robotName');
    const robotCodeAsArray = getRobotCodeAsArray(robotCode);

    const lineNumberSettingsSelector = getLineNumberForSelector(robotCodeAsArray, '*** Settings ***');
    const lineNumberTasksSelector = getLineNumberForSelector(robotCodeAsArray, '*** Tasks ***');

    let robotCodeSettingsSection; let robotCodeTaskSection;
    if (typeof lineNumberSettingsSelector !== 'undefined' && typeof lineNumberTasksSelector !== 'undefined') {
        robotCodeSettingsSection = robotCodeAsArray.slice(lineNumberSettingsSelector, lineNumberTasksSelector);
        robotCodeTaskSection = robotCodeAsArray.slice(lineNumberTasksSelector);
    }

    const declaredApplications = getApplicationArray(robotCodeSettingsSection);
    const elementsArray = getElementsArray(robotCodeTaskSection, declaredApplications, robotId);

    if (typeof elementsArray !== 'undefined') {
        const ssot = {
            _id: robotId,
            starterId: getStarterId(elementsArray),
            robotName,
            elements: elementsArray
        };
        return ssot;
    }
    return undefined;
}

module.exports = {
    parseRobotCodeToSsot,
    getLineNumberForSelector,
    getRobotCodeAsArray,
    getApplicationArray,
    getElementsArray
};
