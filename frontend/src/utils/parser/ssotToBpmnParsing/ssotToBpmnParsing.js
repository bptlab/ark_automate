/* eslint-disable no-loop-func */
/**
 * @category Frontend
 * @module
 */

const DEFAULT_STARTER = 'Event_13c1i8b';
const DEFAULT_PARENT = 'Participant_0cyhvx8';
const DEFAULT_SPACING = '150,0';
const DEFAULT_STARTEVENT_POSITION = '200,330';

/**
 * @description Searches through the ssot and return the only element without a predecessor
 * @param {Object} ssot Ssot that will be processed
 * @returns {Object} startElement from the ssot
 */
const findStartElement = (ssot) =>
  ssot.elements.find(
    (element) => element.type === 'MARKER' && element.predecessorIds.length < 1
  );

/**
 * @description Creates an order within the elements based on their positioning in the flow
 * @param {Object} ssot Ssot that will be processed
 * @returns {Array} Elements of the ssot in the correct order in which they appear in the flow
 */
const buildCorrectOrder = (ssot) => {
  const startElement = findStartElement(ssot);
  const elementsInOrder = [startElement];
  let currentElement = startElement;
  for (let i = 1; i < ssot.elements.length; i += 1) {
    currentElement = ssot.elements.find(
      (element) => element.id === currentElement.successorIds[0]
    );
    elementsInOrder.push(currentElement);
  }
  return elementsInOrder;
};

/**
 * @description Workaround which takes in the created element and updates its id to the one saved in the ssot.
 * The bpmn js cli extension will just create elements, but not ensure their Id to match the one in the ssot therefore this workaround is needed.
 * @param {*} modeling Modeling extension
 * @param {*} cli Modeling cli extension
 * @param {Object} element First element (start element) to process
 * @param {*} cliResult Bpmn object
 * @returns {String} Now set id of the shape
 */
const updateIdForElement = (modeling, cli, element, cliResult) => {
  const bpmnObject = cli.element(cliResult);
  const newId = element.id;

  const updatedIdProperty = { id: newId };
  modeling.updateProperties(bpmnObject, updatedIdProperty);
  return newId;
};

/**
 * @description Creates the first element in the BPMN diagram as a start event
 * @param {*} cli Modeling cli extension
 * @param {*} modeling Modeling extension
 * @param {Object} element First element (start element) to process
 * @param {String} previousElement Id of the previous element
 * @returns {String} Id of the element created in the diagram
 */
const drawElement = (cli, modeling, element, previousElement) => {
  let createdElement;
  switch (element.type) {
    case 'INSTRUCTION':
      createdElement = cli.append(
        previousElement,
        'bpmn:Task',
        DEFAULT_SPACING
      );
      break;
    case 'MARKER':
      // currently this can only be an end event; in the future there should be another switch here
      createdElement = cli.append(
        previousElement,
        'bpmn:EndEvent',
        DEFAULT_SPACING
      );
      break;
    default:
      break;
  }

  const newId = updateIdForElement(modeling, cli, element, createdElement);
  if (element.name) cli.setLabel(newId, element.name);
  return newId;
};

/**
 * @description Checks if the default start event is still present and will remove if so
 * @param {*} cli Modeling cli extension
 */
const removeDefaultStarter = (cli) => {
  if (cli.elements().includes(DEFAULT_STARTER))
    cli.removeShape(DEFAULT_STARTER);
};

/**
 * @description Creates the first element in the BPMN diagram as a start event
 * @param {*} cli Modeling cli extension
 * @param {*} modeling Modeling extension
 * @param {Object} element First element (start element) to process
 * @returns {String} Id of the element created in the diagram
 */
const drawStartElement = (cli, modeling, element) => {
  removeDefaultStarter(cli);
  const startElement = cli.create(
    'bpmn:StartEvent',
    DEFAULT_STARTEVENT_POSITION,
    DEFAULT_PARENT
  );
  const newId = updateIdForElement(modeling, cli, element, startElement);

  if (element.name) cli.setLabel(newId, element.name);
  return newId;
};

/**
 * @description Creates the BPMN XML from the provided ssot, as well as displaying the diagram on the modeling component
 * @param {*} modeler Bpmn modeler
 * @param {Object} ssot Ssot to parse
 * @returns {String} Parsed XML BPMN diagram as a String
 */
const parseSsotToBpmn = (modeler, ssot) => {
  const sortedElements = buildCorrectOrder(ssot);
  const cli = modeler.get('cli');
  const modeling = modeler.get('modeling');

  let lastDrawnElement = drawStartElement(
    cli,
    modeling,
    sortedElements.shift()
  );
  sortedElements.forEach((elementToDraw) => {
    lastDrawnElement = drawElement(
      cli,
      modeling,
      elementToDraw,
      lastDrawnElement
    );
  });
};

export default parseSsotToBpmn;
