/* eslint-disable no-underscore-dangle */

/**
 * @category Server
 * @module
 */

/**
 * @description Creates a base element of the single source of truth
 * @returns {object}  Base element of the single source of truth
 */
const createBaseElement = (id) => {
    const baseElement = {
        "type": "",
        "name": "",
        "id": id,
        "predecessorIds": [],
        "successorIds": []
    }
    return baseElement
};

/**
 * @description Creates the metadata object of the single source of truth
 * @returns {object}  Metadata object of the single source of truth
 */
const createMetadataObj = () => {
    const metadataObj = {
        "robotId": "exampleRobot",
        "starterId": "exampleID"
    }
    return metadataObj
};

/**
 * @description Checks if the given id can be found in the given Array of element objects
 * @returns {boolean}  Boolean if element is tracked in Array
 */
const isElementTracked = (elementsArray, id) => {
    if (elementsArray.find(element => (element.id === id))) {
        return true
    }
    return false
}

/**
 * @description Creates the array full of elements by iterating over the
 * referenced ids in the flow and adding new elements if they have not been added yet
 * @returns {Array}  Array of elements with their id, successors and predecessors
 */
const findElements = (flows) => {
    const elementsArray = []

    flows.forEach((flow) => {
        const source = flow._attributes.sourceRef
        const target = flow._attributes.targetRef

        if (!isElementTracked(elementsArray, source)) {
            const newElement = createBaseElement(source)
            newElement.successorIds.push(target)
            elementsArray.push(newElement)
        } else {
            const sourceElement = elementsArray.find(element => (element.id === source))
            sourceElement.successorIds.push(target)
        }

        if (!isElementTracked(elementsArray, target)) {
            const newElement = createBaseElement(target)
            newElement.predecessorIds.push(source)
            elementsArray.push(newElement)
        } else {
            const targetElement = elementsArray.find(element => (element.id === source))
            targetElement.predecessorIds.push(source)
        }
    })

    return elementsArray
}

/**
 * @description Enriches elements in the elementsArray that should be of type instruction
 * @returns {Array}  Array of elements for single source of truth
 */
const enrichInstructionElements = (elementsArray, bpmnActivities) => {
    bpmnActivities.forEach((activity) => {
        const instructionElement = elementsArray.find(element => (element.id === activity._attributes.id))
        instructionElement.name = activity._attributes.name
        instructionElement.type = "INSTRUCTION"

        if (activity._attributes["arkRPA:application"]) {
            instructionElement.rpaApplication = activity._attributes["arkRPA:application"]
            instructionElement.rpaTask = activity._attributes["arkRPA:task"]

            const parameterArray = []
            const parameterObj = JSON.parse(activity._attributes["arkRPA:inputVars"])
            Object.keys(parameterObj).forEach((key) => {
                const inputVar = {}
                inputVar.name = key
                inputVar.value = parameterObj[key]
                inputVar.requireUserInput = true
                parameterArray.push(inputVar)
            })

            instructionElement.rpaParameters = parameterArray
        }
        instructionElement.outputVariable = ""

    })
    return elementsArray
}

/**
 * @description Enriches elements in the elementsArray that should be of type marker
 * @returns {Array}  Array of elements for single source of truth
 */
const enrichMarkerElements = (elementsArray) => {
    const eventRegularExpression = new RegExp("^Event_.*$")
    elementsArray.forEach(element => {
        if (eventRegularExpression.test(element.id)) {
            element.type = "MARKER"
        }
    })
    return elementsArray
}

/**
 * @description Parses an JSON created from the .bpmn xml of the model to the single source of truth
 * @returns {string} Code that has to be put in single source of truth file
 */
const parseDiagramToSsot = (bpmnJson) => {

    const ssot = {}
    ssot.robotMetadata = createMetadataObj()

    const flows = bpmnJson['bpmn2:definitions']['bpmn2:process']['bpmn2:sequenceFlow'];
    let elementsArray = findElements(flows)

    const bpmnActivities = bpmnJson['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];
    elementsArray = enrichInstructionElements(elementsArray, bpmnActivities)
    elementsArray = enrichMarkerElements(elementsArray)

    ssot.elements = elementsArray
    return JSON.stringify(ssot, null, 2);
};

module.exports = { parseDiagramToSsot }
