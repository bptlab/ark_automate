
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
 * @description Parses an JSON created from the .bpmn xml of the model to the single source of truth
 * @returns {string} Code that has to be put in single source of truth file
 */
const parseDiagramToSsot = (bpmnJson) => {

    let ssotJson = '';
    const ssot = {}

    const metadataObj = {
        "robotId": "exampleRobot",
        "starterId": "exampleID"
    }
    ssot["robotMetadata"] = metadataObj


    const elementsArray = []
    const flows = bpmnJson['bpmn2:definitions']['bpmn2:process']['bpmn2:sequenceFlow'];



    flows.forEach((flow) => {
        const source = flow._attributes.sourceRef
        const target = flow._attributes.targetRef
        // check source of flow
        if (!elementsArray.find(element => (element.id === source))) {
            // not in elementsArray
            const newElement = createBaseElement(source)
            newElement.successorIds.push(target)
            elementsArray.push(newElement)
        } else {
            const sourceElement = elementsArray.find(element => (element.id === source))
            sourceElement.successorIds.push(target)
        }

        // check target of flow
        if (!elementsArray.find(element => (element.id === target))) {
            // not in elementsArray
            const newElement = createBaseElement(target)
            newElement.predecessorIds.push(source)
            elementsArray.push(newElement)
        } else {
            const targetElement = elementsArray.find(element => (element.id === source))
            targetElement.predecessorIds.push(source)
        }
    })

    const bpmnActivities = bpmnJson['bpmn2:definitions']['bpmn2:process']['bpmn2:task'];

    bpmnActivities.forEach((activity) => {
        const element = elementsArray.find(element => (element.id === activity._attributes.id))
        element.name = activity._attributes.name
        element.type = "INSTRUCTION"
        if (activity["_attributes"]["arkRPA:application"]) {
            // then is rpa activity
            element["rpaApplication"] = activity["_attributes"]["arkRPA:application"]
            element["rpaTask"] = activity["_attributes"]["arkRPA:task"]

            const parameterArray = []
            const parameterObj = JSON.parse(activity["_attributes"]["arkRPA:inputVars"])
            for (parameter in parameterObj) {
                const inputVar = {}
                inputVar["name"] = parameter
                inputVar["value"] = parameterObj[parameter]
                inputVar["requireUserInput"] = true
                parameterArray.push(inputVar)
            }
            element["rpaParameters"] = parameterArray
            // input element["rpaParameters"] = activity["_attributes"]["arkRPA:inputVars"]
        }
        element["outputVariable"] = ""

    })

    // detect events
    const re = new RegExp("^Event_.*$")
    elementsArray.forEach(element => {
        if (re.test(element.id)) {
            element.type = "MARKER"
        }
    })

    ssot["elements"] = elementsArray

    ssotJson = JSON.stringify(ssot, null, 2)
    // console.log(ssotJson)
    return ssotJson;
};

module.exports = { parseDiagramToSsot }
