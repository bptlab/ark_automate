/* eslint-disable no-alert */
const { parseString } = require('xmljs2');

/**
 * @category Client
 * @module
 */

const SsotBaseObjects = require('./SsotBaseObjects');

const ssotBaseElement = SsotBaseObjects.baseElement;

/**
 * @description Creates a base element of the single source of truth
 * @returns {object}  Base element of the single source of truth
 */
const createBaseElement = (id) => {
  const baseElement = ssotBaseElement;
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
 * @description Creates the array full of elements by iterating over the
 * referenced ids in the flow and adding new elements if they have not been added yet
 * @returns {Array}  Array of elements with their id, successors and predecessors
 */
const findElements = (flows) => {
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
      console.log(newElement)
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
    console.log(localElementsArray)
  });
  return localElementsArray;
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
    instructionElement.name = activity.$.name;
    instructionElement.type = 'INSTRUCTION';

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

    instructionElement.outputVariable = '';
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
  if (typeof startEvents === 'undefined') {
    startEvents = [];
  }
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

/**
 * @description Parses an JSON created from the xml of the bpmn model to the single source of truth
 * @returns {string} XML that has to be put in single source of truth file
 */
const parseBpmnToSsot = async (bpmnXml, robotId) => {
  let bpmnJson;
  let startEventId;
  let ssot;

  const robotName = sessionStorage.getItem('robotName')

  return parseString(bpmnXml.xml)
    .then((result) => {
      bpmnJson = result;
      console.log(bpmnJson)
      startEventId = getStartEventId(bpmnJson);

      // Build basic ssot-frame
      ssot = {
        _id: robotId,
        starterId: startEventId,
        robotName,
      };
    })
    // This part of the code calls the real parsing steps 
    // => maybe we should rename & refactor it (incl. parseString())
    .then(() => {
      let flows = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:sequenceFlow'];
      if (typeof flows === 'undefined') {
        flows = [];
      }
      // eslint-disable-next-line no-console
      console.log(`Anzahl Kanten: ${flows.length}`)

      let bpmnActivities = bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:task'];
      if (typeof bpmnActivities === 'undefined') {
        bpmnActivities = [];
      }
      // eslint-disable-next-line no-console
      console.log(`Anzahl Aktivitäten: ${bpmnActivities.length}`)

      let elementsArray = findElements(flows);
      elementsArray = enrichInstructionElements(elementsArray, bpmnActivities);
      elementsArray = enrichMarkerElements(elementsArray);

      ssot.elements = elementsArray;
      return ssot;
    })
    .then(() => ssot)
}

module.exports = { parseBpmnToSsot };
