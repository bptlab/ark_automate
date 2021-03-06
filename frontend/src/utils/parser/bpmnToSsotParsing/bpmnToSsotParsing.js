/* eslint-disable no-param-reassign */
import { parseString } from 'xmljs2';
import customNotification from '../../componentsFunctionality/notificationUtils';
import {
  getRobotId,
  getRobotName,
} from '../../sessionStorage/localSsotController/ssot';
import ssotBaseObjects from '../ssotBaseObjects';

/**
 * @category Frontend
 * @module
 */

const ssotBaseElement = ssotBaseObjects.baseElement;

/**
 * @description Creates a base element of the single source of truth
 * @returns {Object}  Base element of the single source of truth
 */
const createBaseElement = (id) => {
  const baseElement = JSON.parse(JSON.stringify(ssotBaseElement));
  baseElement.id = id;
  return baseElement;
};

/**
 * @description Checks if the given id can be found in the given Array of element objects
 * @returns {Boolean}  Boolean if element is tracked in Array
 */
const isElementTracked = (elementsArray, id) => {
  if (elementsArray.find((element) => element.id === id)) {
    return true;
  }
  return false;
};

/**
 * @description Gets all bpmn elements
 * @param {Array} bpmnShapes All shapes of the BPMN diagram
 * @param {Array} localElementsArray Current version of the localElementsArray with all elements
 * @returns {Array}  Array of elements with their id, successors, predecessors and name
 */
const returnElementsArrayWithNameLabel = (bpmnShapes, localElementsArray) => {
  const updatedLocalElementsArray = [];

  localElementsArray.forEach((element) => {
    const matchingElement = bpmnShapes.find(
      (shape) => element.id === shape.$.id
    );
    const newElement = element;
    newElement.name = matchingElement.$.name;
    updatedLocalElementsArray.push(newElement);
  });

  return updatedLocalElementsArray;
};

/**
 * @description Creates the array full of elements by iterating over the
 * referenced ids in the flow and adding new elements (incl. name) if they have not been added yet
 * @param {Array} flows All flow elements of the BPMN diagram
 * @param {Array} bpmnShapes All shapes of the BPMN diagram
 * @returns {Array}  Array of elements with their id, successors, predecessors and name
 */
const findElements = (flows, bpmnShapes) => {
  if (typeof flows === 'undefined') {
    return [];
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
      const sourceElement = localElementsArray.find(
        (element) => element.id === flowSource
      );
      sourceElement.successorIds.push(flowTarget);
    }

    if (!isElementTracked(localElementsArray, flowTarget)) {
      const newElement = createBaseElement(flowTarget);
      newElement.predecessorIds.push(flowSource);
      localElementsArray.push(newElement);
    } else {
      const targetElement = localElementsArray.find(
        (element) => element.id === flowSource
      );
      targetElement.predecessorIds.push(flowSource);
    }
  });
  return returnElementsArrayWithNameLabel(bpmnShapes, localElementsArray);
};

/**
 * @description Enriches elements in the elementsArray that should be of type instruction
 * @param {Array} elementsArray All elements of the BPMN diagram
 * @param {Array} bpmnActivities All activities of the BPMN diagram
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
      instructionElement.outputValue = '';
    }

    if (activity.$['arkRPA:application']) {
      instructionElement.rpaApplication = activity.$['arkRPA:application'];
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
 * @param {Array} elementsArray All elements of the BPMN diagram
 * @returns {Array}  Array of elements for single source of truth
 */
const enrichMarkerElements = (elementsArray) => {
  const eventRegularExpression = /^Event_.*$/;
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

  startEvents =
    bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:startEvent'];
  if (typeof startEvents === 'undefined') startEvents = [];

  startEvents.forEach((singleStartEvent) => {
    startEventIds.push(singleStartEvent.$.id);
  });

  if (startEventIds.length === 0) {
    customNotification(
      'Error',
      'There is no startEvent in your diagram! \nThis is not Ark-Automate Ssot compliant.'
    );
    return undefined;
  }
  if (startEventIds.length > 1) {
    customNotification(
      'Error',
      'There is more then one startEvent in your diagram! \nThis is not Ark-Automate Ssot compliant.'
    );
    return undefined;
  }
  return startEventIds;
};

/**
 * @description Parses an JSON created from the xml of the bpmn model to the single source of truth
 * @param {Object} bpmnXml The xml object of the bpmn diagram
 * @returns {string} XML that has to be put in single source of truth file
 */
const parseBpmnToSsot = async (bpmnXml) => {
  const robotName = getRobotName();
  const robotId = getRobotId();
  const bpmnJson = await parseString(bpmnXml.xml);
  const startEventId = getStartEventId(bpmnJson);

  if (typeof startEventId === 'undefined') return undefined;

  const ssot = {
    _id: robotId,
    starterId: startEventId[0],
    robotName,
  };

  let flows =
    bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:sequenceFlow'];
  if (typeof flows === 'undefined') flows = [];

  let bpmnActivities =
    bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:task'];
  if (typeof bpmnActivities === 'undefined') bpmnActivities = [];

  const bpmnStartEvent =
    bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:startEvent'];
  const bpmnEndEvent =
    bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:endEvent'];
  const bpmnShapes = bpmnJson['bpmn2:definitions']['bpmn2:process'][0][
    'bpmn2:task'
  ]
    .concat(
      bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:startEvent']
    )
    .concat(
      bpmnJson['bpmn2:definitions']['bpmn2:process'][0]['bpmn2:endEvent']
    );

  let elementsArray = findElements(flows, bpmnShapes);
  elementsArray = enrichInstructionElements(elementsArray, bpmnActivities);
  elementsArray = enrichMarkerElements(
    elementsArray,
    bpmnStartEvent,
    bpmnEndEvent
  );

  ssot.elements = elementsArray;
  return ssot;
};

// eslint-disable-next-line import/prefer-default-export
export { parseBpmnToSsot };
