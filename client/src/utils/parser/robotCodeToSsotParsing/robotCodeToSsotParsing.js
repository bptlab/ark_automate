/* eslint-disable no-alert */
// eslint-disable-next-line no-var

const { parseString } = require('xmljs2');


/**
 * @category Client
 * @module
 */

const NUMBER_OF_SPACES = 4;

const SsotBaseObjects = require('../SsotBaseObjects');

const ssotBaseElement = SsotBaseObjects.baseElement;

/**
 * @description Creates a base element of the single source of truth
 * @returns {object}  Base element of the single source of truth
 */
const createBaseElement = (id) => {
    // creates deep copy of baseElement
    const baseElement = JSON.parse(JSON.stringify(ssotBaseElement));
    baseElement.id = id;
    return baseElement;
};

/**
 * @description Checks if the given id can be found in the given Array of element objects
 * @returns {boolean}  Boolean if element is tracked in Array
 */
const isElementTracked = (elementsArray, id) => {
    if (elementsArray.find((element) => element.id === id)) {
        return true;
    }
    return false;
};

/**
 * 
 * @param {Array} bpmnShapes all shapes of the BPMN diagram
 * @param {Array} localElementsArray current version of the localElementsArray with all elements
 * @returns {Array}  Array of elements with their id, successors, predecessors and name
 */
const returnElementsArrayWithNameLabel = (bpmnShapes, localElementsArray) => {
    const updatedLocalElementsArray = [];

    localElementsArray.forEach((element) => {
        const matchingElement = bpmnShapes.find((shape) => element.id === shape.$.id)
        const newElement = element;
        newElement.name = matchingElement.$.name;
        updatedLocalElementsArray.push(newElement)
    })

    return updatedLocalElementsArray;
}

/**
 * @description Creates the array full of elements by iterating over the
 * referenced ids in the flow and adding new elements (incl. name) if they have not been added yet
 * @returns {Array}  Array of elements with their id, successors, predecessors and name
 */
const findElements = (flows, bpmnShapes) => {
    if (typeof flows === 'undefined') {
        return []
    }

    const localElementsArray = [];

    flows.forEach((flow) => {
        const flowSource = flow.$.sourceRef;
        const flowTarget = flow.$.targetRef;

        if (!isElementTracked(localElementsArray, flowSource)) {
            const newElement = createBaseElement(flowSource);
            newElement.successorIds.push(flowTarget);
            localElementsArray.push(newElement);
        } else {
            const sourceElement = localElementsArray.find((element) =>
                element.id === flowSource
            );
            sourceElement.successorIds.push(flowTarget);
        }

        if (!isElementTracked(localElementsArray, flowTarget)) {
            const newElement = createBaseElement(flowTarget);
            newElement.predecessorIds.push(flowSource);
            localElementsArray.push(newElement);
        } else {
            const targetElement = localElementsArray.find((element) =>
                element.id === flowSource
            );
            targetElement.predecessorIds.push(flowSource);
        }
    });
    return returnElementsArrayWithNameLabel(bpmnShapes, localElementsArray)
};

/**
 * @description Enriches elements in the elementsArray that should be of type instruction
 * @returns {Array}  Array of elements for single source of truth
 */
const enrichInstructionElements = (elementsArray, bpmnActivities) => {
    if (typeof bpmnActivities === 'undefined') {
        return [];
    }

    bpmnActivities.forEach((activity) => {
        const instructionElement = elementsArray.find(
            (element) => element.id === activity.$.id
        );
        if (instructionElement) {
            instructionElement.type = 'INSTRUCTION';
            instructionElement.outputVariable = '';
        }

        if (activity.$['arkRPA:application']) {
            instructionElement.rpaApplication =
                activity.$['arkRPA:application'];
            instructionElement.rpaTask = activity.$['arkRPA:task'];

            const parameterArray = [];
            const parameterObj = JSON.parse(activity.$['arkRPA:inputVars']);
            Object.keys(parameterObj).forEach((key) => {
                const inputVar = {};
                inputVar.name = key;
                inputVar.value = parameterObj[key];
                inputVar.requireUserInput = true;
                parameterArray.push(inputVar);
            });
            instructionElement.rpaParameters = parameterArray;
        }

    });
    return elementsArray;
};

/**
 * @description Enriches elements in the elementsArray that should be of type marker
 * @returns {Array}  Array of elements for single source of truth
 */
const enrichMarkerElements = (elementsArray) => {
    const eventRegularExpression = new RegExp('^Event_.*$');
    elementsArray.forEach((element) => {
        if (eventRegularExpression.test(element.id)) {
            element.type = 'MARKER';
        }
    });
    return elementsArray;
};

const getStartEventId = (bpmnJson) => {
    let startEvents;
    const startEventIds = [];

    startEvents = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:startEvent']
    if (typeof startEvents === 'undefined') startEvents = [];

    startEvents.forEach(singleStartEvent => {
        startEventIds.push(singleStartEvent.$.id);
    });

    if (startEventIds.length === 0) {
        alert("There is no startEvent in your diagram! \nThis is not Ark-Automate Ssot compliant.");
    } else if (startEventIds.length > 1) {
        alert("There is more then one startEvent in your diagram! \nThis is not Ark-Automate Ssot compliant.");
    }
    return startEventIds;
}

// todo
const getUniqueId = () => {
    const newId = JSON.parse(sessionStorage.getItem('idCounter')) + 1;
    sessionStorage.setItem('idCounter', newId)
    return `Activity_0ay${newId}`
}

// todo
const getApplicationArray = (robotCodeSettingsSection) => {
    const robotCode = robotCodeSettingsSection.slice(1)
    for (let i = 0; i < robotCode.length; i += 1) {
        if (robotCode[i] === '') {
            robotCode.splice(i, 1);
        }
    }

    // test if every line starts with Library
    robotCode.forEach((element) => {
        if (!element.startsWith('Library ')) {
            alert('Every line of the \'*** Settings ***\' Section has to start with \'Library\'!');
        }
    });

    // test if spacing in every line is correct
    const regexForRightSpacing = new RegExp(`Library +Rz*`)
    robotCode.forEach((line) => {
        if (!regexForRightSpacing.test(line)) {
            alert('Spacing error between \'Library\' and \'RPA. ...\'');
        }
    });

    // test if RPA ist correct alias
    const regexForRpaAlias = new RegExp(`Library +RPA[.][a-zA-Z]+`)
    robotCode.forEach((line) => {
        if (!regexForRpaAlias.test(line)) {
            alert('Application has to start with \'RPA.\'');
        }
    });

    const declaredApplications = [];
    robotCode.forEach((line) => {
        declaredApplications.push(line.split("RPA.")[1]);
    })

    // test if Application is part of all applications
    declaredApplications.forEach((application) => {
        const availableApplications = JSON.parse(sessionStorage.getItem('availableApplications'))
        if (!availableApplications.includes(application)) {
            alert(`The Application ${String(application)} is currently not supported. `);
        }
    })

    return declaredApplications;
}


/*
*   every construction block contains two lines (entries in the array):
*   #elementName
*   Task Parameter1 Parameter2
*/
const getInstructionBlocksFromTaskSection = (robotCodeTaskSection, declaredApplications) => {
    let currentApplication;
    const instructionBlocks = [];
    const regexForElementNameLine = new RegExp(`#`)
    const regexForTaskAndParamLine = new RegExp(`s`)

    for (let lineNumber = 1; lineNumber < robotCodeTaskSection.length; lineNumber += 1) {
        let currentLine = robotCodeTaskSection[lineNumber]

        if (currentLine.replaceAll(' ', '') === '') {
            continue; // ignores empty lines
        }

        if (declaredApplications.includes(currentLine)) {
            currentApplication = currentLine;
            continue;
        }

        if (regexForElementNameLine.test(currentLine)) {
            instructionBlocks.push([currentApplication, currentLine.substring(1)])
            continue;
        }

        if (regexForTaskAndParamLine.test(currentLine)) {
            currentLine = currentLine.trim()
            instructionBlocks[instructionBlocks.length - 1].push(currentLine)
            continue;
        }

        // todo implement outputVariables

    }
    return instructionBlocks
}

const buildStartMarker = () => ({
    "successorIds": [],
    "id": getUniqueId(),
    "type": "MARKER",
    "name": "START",
    "predecessorIds": []
})

const buildEndMarker = (successor) => ({
    "successorIds": [],
    "id": getUniqueId(),
    "type": "MARKER",
    "name": "END",
    "predecessorIds": [successor ? successor.id : 'MarkerElement']

})

const buildSingleAttributeObject = (currentElement, singleElement, robotId) => {
    let rpaTask = singleElement[2];
    if (!rpaTask) rpaTask = ""
    if (rpaTask.includes('§&§')) {
        alert('it is not allowed to use & or § as param values')
    } else {
        rpaTask = rpaTask.replaceAll('    ', '§&§');
    }

    if (rpaTask.includes('§&§')) {
        rpaTask = rpaTask.slice(0, rpaTask.indexOf('§&§'))
    }

    return {
        activityId: currentElement.id,
        rpaApplication: singleElement[0],
        rpaTask,
        ssotId: robotId
    }
}

const buildSingleParameterObject = (singleAtrributeObject, currentElement, singleElement, robotId, taskAndApplicationCombinations) => {
    const { rpaApplication } = singleAtrributeObject;
    const { rpaTask } = singleAtrributeObject;
    /*     console.log(rpaApplication)
        console.log(rpaTask)
        console.log(taskAndApplicationCombinations)
     */

    const combinationObject = taskAndApplicationCombinations.filter((singleCombinationObject) =>
        (singleCombinationObject.Application === rpaApplication && singleCombinationObject.Task === rpaTask)
    )[0]

    console.log(combinationObject)

    const rpaParameterArray = [];

    combinationObject.inputVars.forEach((singleInputVariable) => {
        const singleParameterObject = {
            index: singleInputVariable.index,
            infoText: singleInputVariable.infoText,
            isRequired: singleInputVariable.isRequired,
            name: singleInputVariable.name,
            type: singleInputVariable.type,
            value: 'TESTVALUE'
        };

        rpaParameterArray.push(singleParameterObject)
    })

    console.log(rpaParameterArray)

    return {
        activityId: currentElement.id,
        rpaParameters: rpaParameterArray,
        ssotId: robotId
    }
}




// todo
const getInstructionElements = (robotCodeTaskSection, declaredApplications, robotId) => {
    const taskAndApplicationCombinations = JSON.parse(sessionStorage.getItem('TaskApplicationCombinations'));
    const instructionArray = getInstructionBlocksFromTaskSection(robotCodeTaskSection, declaredApplications)
    const instructionElement = [];
    const attributeArray = [];
    const parameterArray = [];

    instructionElement.push(buildStartMarker())

    instructionArray.forEach((singleElement) => {
        const currentElement = {}
        currentElement.successorIds = []

        currentElement.id = getUniqueId();
        currentElement.type = "INSTRUCTION";
        currentElement.name = singleElement[1];
        const predecessor = instructionElement[instructionElement.length - 1]
        currentElement.predecessorIds = predecessor && [predecessor.id]
        if (predecessor) predecessor.successorIds = [currentElement.id];

        instructionElement.push(currentElement)

        const singleAtrributeObject = buildSingleAttributeObject(currentElement, singleElement, robotId);
        attributeArray.push(singleAtrributeObject)

        // enrich parameterObject
        const singleParameterObject = buildSingleParameterObject(singleAtrributeObject, currentElement, singleElement, robotId, taskAndApplicationCombinations);
        parameterArray.push(singleParameterObject)
    })
    sessionStorage.removeItem('attributeLocalStorage')
    sessionStorage.setItem('attributeLocalStorage', JSON.stringify(attributeArray));
    console.log('attributeArray')
    console.log(attributeArray);
    sessionStorage.setItem('parameterLocalStorage', JSON.stringify(parameterArray));
    console.log('paramArray')
    console.log(parameterArray)

    instructionElement.push(buildEndMarker(instructionElement[instructionElement.length - 1]))
    const lastElement = instructionElement[instructionElement.length - 1]
    const secontlLstElement = instructionElement[instructionElement.length - 2]
    secontlLstElement.successorIds = [lastElement.id]

    return instructionElement;
}

const getStarterId = (elementsArray) => {
    let starterElementId = 'noStarterElement';
    elementsArray.forEach((singleElement) => {
        if (singleElement.type === 'MARKER' && singleElement.predecessorIds.length === 0) {
            starterElementId = singleElement.id;
        }
    })
    return starterElementId;
}


/**
 * @description Parses an JSON created from the xml of the bpmn model to the single source of truth
 * @returns {string} XML that has to be put in single source of truth file
 */
const parseRobotCodeToSsot = (robotCode) => {

    const robotId = JSON.parse(sessionStorage.getItem('robotId'));
    const robotName = sessionStorage.getItem('robotName');
    const robotCodeAsArray = robotCode.split('\n');
    const lineNumberTasksSelector = robotCodeAsArray.indexOf('*** Tasks ***')
    const lineNumberSettingsSelector = robotCodeAsArray.indexOf('*** Settings ***')
    const robotCodeSettingsSection = robotCodeAsArray.slice(lineNumberSettingsSelector, lineNumberTasksSelector);
    const robotCodeTaskSection = robotCodeAsArray.slice(lineNumberTasksSelector);

    const declaredApplications = getApplicationArray(robotCodeSettingsSection)

    const elementsArray = getInstructionElements(robotCodeTaskSection, declaredApplications, robotId)
    console.log(elementsArray)

    // Build ssot
    const ssot = {
        _id: robotId,
        starterId: getStarterId(elementsArray),
        robotName,
        elements: elementsArray
    };

    // console.log(JSON.parse(sessionStorage.getItem('ssotLocal')));

    return ssot;

    let flows = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:sequenceFlow'];
    if (typeof flows === 'undefined') flows = [];

    let bpmnActivities = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:task'];
    if (typeof bpmnActivities === 'undefined') bpmnActivities = [];

    const bpmnStartEvent = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:startEvent'];
    const bpmnEndEvent = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:endEvent'];
    const bpmnShapes = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:startEvent']
        .concat(bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:task'])
        .concat(bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:endEvent'])

    let elementsArrayOld = findElements(flows, bpmnShapes);
    elementsArrayOld = enrichInstructionElements(elementsArrayOld, bpmnActivities);
    elementsArrayOld = enrichMarkerElements(elementsArrayOld, bpmnStartEvent, bpmnEndEvent);
}

module.exports = { parseRobotCodeToSsot };
