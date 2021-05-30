/* eslint-disable no-param-reassign */

/**
 * @category Frontend
 * @module
 */

import {
  setRpaTask,
  setRpaApplication,
} from '../../../../../utils/sessionStorage/localSsotController/attributes';
import {
  setSingleParameter,
  setOutputValueName,
  getParameterObject,
} from '../../../../../utils/sessionStorage/localSsotController/parameters';
import { getParsedRobotFile } from '../../../../../api/routes/robots/robots';
import downloadString from './downloadStringAsFile';
import {
  getRobotName,
  upsert,
} from '../../../../../utils/sessionStorage/localSsotController/ssot';
import { parseBpmnToSsot } from '../../../../../utils/parser/bpmnToSsotParsing/bpmnToSsotParsing';

/**
 * @description Called when the the button is pressed to save to the cloud.
 * This function will retrieve the xml from the parser, parse that xml to a ssot and write the
 * resulting ssot into the sessionStorage.
 * @param {Object} modeler The modeling object
 */
const onSaveToCloud = async (modeler) => {
  const xml = await modeler.saveXML({ format: true });
  const result = await parseBpmnToSsot(xml);
  const ssot = JSON.stringify(result);
  sessionStorage.setItem('ssotLocal', ssot);
  upsert();
};

/**
 * @description Parses the ssot which can be found in the database correlating to the specified id
 * @param {String} robotId Id of the robot
 */
const downloadRobotFile = async (robotId) => {
  const response = await (await getParsedRobotFile(robotId)).text();
  const fileName = `${getRobotName()}.robot`;
  downloadString(response, 'text/robot', fileName);
};

/**
 * @description Updates the element state upon selection of a new element.
 * @param {Object} event Event containing the information about the new element selected
 * @param {Object} elementState State of the element
 * @param {Object} setterObject Object containing the functions for setting the state in the React component
 */
const modelerElementChangeHandler = (event, elementState, setterObject) => {
  if (!elementState.currentElement) {
    return;
  }
  if (event.element.id === elementState.currentElement.id) {
    setterObject.setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: event.element,
    });
  }
};

/**
 * @description Sets all tasks for currently selected application from session storage
 * @param {String} application Application for which to get the tasks for.
 * @param {Array} taskApplicationCombinations Array of task and application combination objects.
 * @param {Object} setterObject Object containing the functions for setting the state in the React component.
 */
const getTasksForApplication = (
  application,
  taskApplicationCombinations,
  setterObject
) => {
  const allMatchingApplicationCombinations = taskApplicationCombinations.filter(
    (singleCombination) => singleCombination.application === application
  );
  const allTasksForApplication = allMatchingApplicationCombinations.map(
    (singleCombination) => singleCombination.task
  );
  setterObject.setTasksForSelectedApplication(allTasksForApplication);
  setterObject.setDisableTaskSelection(false);
};

/**
 * @description Checks if a given activity has been configured with an application and/or task.
 * This can be used to trigger the disablement of the task dropdown.
 * @param {String} activityId Id of the activity that will be checked
 * @param {Object} setterObject Object containing the functions for setting the state in the React component
 * @returns {Boolean} Boolean if there is an object found and an application has been previously configured
 */
const checkForApplicationTask = (activityId, setterObject) => {
  const currentAttributes = JSON.parse(
    sessionStorage.getItem('attributeLocalStorage')
  );
  const taskApplicationCombinations = JSON.parse(
    sessionStorage.getItem('taskApplicationCombinations')
  );
  const matchingActivity = currentAttributes.find(
    (element) => element.activityId === activityId
  );

  if (matchingActivity) {
    setterObject.setSelectedApplication(matchingActivity.rpaApplication);
    getTasksForApplication(
      matchingActivity.rpaApplication,
      taskApplicationCombinations,
      setterObject
    );
  }
  return !!matchingActivity && !!matchingActivity.rpaApplication;
};

/**
 * @description Updates the state of the component and retrieves the tasks of the application for the TaskDropdown and clears the TaskDropdown.
 * Called when a new application was selected in the dropwdown in the sidebar.
 * @param {String} activityId Id of the activity for which will be changed
 * @param {String} robotId Id of the that will be updated
 * @param {Object} setterObject Object containing the functions for setting the state in the React component
 */
const updateParamSection = (activityId, robotId, setterObject) => {
  setterObject.setOutputValueName(undefined);
  const paramObj = getParameterObject(robotId, activityId);
  if (paramObj) {
    const paramsInOrder = paramObj.rpaParameters.sort(
      (a, b) => a.index - b.index
    );
    setterObject.setParameterList(paramsInOrder);
    if (paramObj.outputValue)
      setterObject.setOutputValueName(paramObj.outputValue);
  }
};

/**
 * @description Updates the state with attributes matching the new selection. Called upon a change in the modeler. 
 * @param {Object} event Event describing the newly happened change
 * @param {Object} elementState State of the selected element
 * @param {String} robotId Id of the robot which was opened
 * @param {Object} setterObject Object containing the functions for setting the state in the React component
 */
const modelerSelectionChangeHandler = (
  event,
  elementState,
  robotId,
  setterObject
) => {
  setterObject.setElementState({
    selectedElements: event.newSelection,
    currentElement: event.newSelection[0],
  });
  setterObject.setOutputValueName(undefined);
  setterObject.setParameterList([]);

  // INFO: the updated elementState isn't automatically used in useEffect() therefore we need the following workaround
  elementState.selectedElements = event.newSelection;
  const currentElement = event.newSelection[0];
  elementState.currentElement = currentElement;

  if (event.newSelection[0] && event.newSelection[0].type === 'bpmn:Task') {
    setterObject.setDisableTaskSelection(
      !checkForApplicationTask(event.newSelection[0].id, setterObject)
    );

    const localAttributeStorage = JSON.parse(
      sessionStorage.getItem('attributeLocalStorage')
    );
    const matchingAttributeObject = localAttributeStorage.find(
      (element) => element.activityId === event.newSelection[0].id
    );
    if (matchingAttributeObject)
      updateParamSection(event.newSelection[0].id, robotId, setterObject);
  }
};

/**
 * @description Updates the state of the component. Called when the name of the selected element got updated in the sidebar. 
 * @param {Object} event Changed value in input field
 * @param {Object} modeler The modeling object
 * @param {Object} elementState State of the selected element
 * @param {Object} setterObject Object containing the functions for setting the state in the React component
 */
const nameChangedHandler = (event, modeler, elementState, setterObject) => {
  const { currentElement } = elementState;
  currentElement.businessObject.name = event.target.value;
  setterObject.setElementState({
    selectedElements: elementState.selectedElements,
    currentElement,
  });
  const modeling = modeler.get('modeling');
  modeling.updateLabel(elementState.currentElement, event.target.value);
};

/**
 * @description Updates the state of the component and retrieves the tasks of the application for the TaskDropdown and clears the TaskDropdown.
 * Called when a new application was selected in the dropwdown in the sidebar.
 * @param {Object} value New value of the ApplicationDropdown
 * @param {String} robotId Id of the robot
 * @param {Object} elementState State of the selected element
 * @param {Object} setterObject Object containing the functions for setting the state in the React component
 */
const applicationChangedHandler = (
  value,
  robotId,
  elementState,
  setterObject
) => {
  setterObject.setElementState({
    selectedElements: elementState.selectedElements,
    currentElement: elementState.currentElement,
  });
  const taskApplicationCombinations = JSON.parse(
    sessionStorage.getItem('taskApplicationCombinations')
  );

  setterObject.setSelectedApplication(value);
  setRpaApplication(robotId, elementState.currentElement.id, value);
  getTasksForApplication(value, taskApplicationCombinations, setterObject);

  setterObject.setOutputValueName(undefined);
  setterObject.setParameterList([]);
};

/**
 * @description Updates the state of the component and gets the parameters of the task and updates the XML RPA properties (adds the application and the task).
 * Called when a new task was selected in the dropwdown in the sidebar. 
 * @param {Object} value New value of the TaskDropdown
 * @param {String} activityId Id of the activity selected
 * @param {String} robotId Id of the robot
 * @param {String} selectedApplication Application selected
 * @param {Object} setterObject Object containing the functions for setting the state in the React component
 */
const taskChangedHandler = (
  value,
  activityId,
  robotId,
  selectedApplication,
  setterObject
) => {
  setRpaTask(robotId, activityId, selectedApplication, value);
  if (value) updateParamSection(activityId, robotId, setterObject);
};

/**
 * @description Updates the values in the ssot. Called when the value in a single input field for the parameters has been changed 
 * @param {String} activityId Id of the activity selected
 * @param {Object} value New value of input field
 */
const inputParameterChangeHandler = (activityId, value) => {
  setSingleParameter(activityId, value);
};

/**
 * @description Updates the output variables name in the ssot. Called when the name of the output variable has been changed
 * @param {String} activityId Id of the activity selected
 * @param {Object} newValue New value of the output variables name
 */
const outputValueNameChangeHandler = (activityId, newValue) => {
  setOutputValueName(activityId, newValue);
};

export {
  nameChangedHandler,
  applicationChangedHandler,
  taskChangedHandler,
  inputParameterChangeHandler,
  outputValueNameChangeHandler,
  modelerSelectionChangeHandler,
  modelerElementChangeHandler,
  downloadRobotFile,
  onSaveToCloud,
};
