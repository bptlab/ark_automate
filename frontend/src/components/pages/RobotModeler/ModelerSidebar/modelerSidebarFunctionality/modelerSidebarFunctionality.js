/* eslint-disable no-param-reassign */

/**
 * @category Frontend
 * @module
 */

import { fetchTasksFromDB } from '../../../../../api/routes/functionalities/functionalities';
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
import { upsert } from '../../../../../utils/sessionStorage/localSsotController/ssot';
import { parseBpmnToSsot } from '../../../../../utils/parser/bpmnToSsotParsing/bpmnToSsotParsing';

/**
 * @description Gets called when the the button is pressed to save to the cloud.
 * This function will retrieve the xml from the parser, parse that xml to a ssot and write the
 * resulting ssot into the sessionStorage.
 * @param {Object} modeler the modeling object
 * @param {String} robotId id of the robot
 */
const onSaveToCloud = async (modeler, robotId) => {
  const xml = await modeler.saveXML({ format: true });
  const result = await parseBpmnToSsot(xml, robotId);
  const ssot = JSON.stringify(result);
  sessionStorage.setItem('ssotLocal', ssot);
  upsert();
};

/**
 * @description Will parse the ssot which can be found in the database correlating to the specified id
 * @param {String} robotId id of the robot
 */
const downloadRobotFile = async (robotId) => {
  const response = await (await getParsedRobotFile(robotId)).text();
  const fileName = `${sessionStorage.getItem('robotName')}.robot`;
  downloadString(response, 'text/robot', fileName);
};

/**
 * @description Will update the element state upon selection od a new element.
 * @param {Object} event event containing the information about the new element selected
 * @param {Object} elementState State of the element
 * @param {Object} setterObject object containing the functions for setting the state in the React component
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
 * @description Checks if tasks for selected application are already stored in session storage.
 * Otherwise, fetch tasklist from MongoDB.
 * @param {String} application Application for which to get the tasks for.
 * @param {Object} setterObject object containing the functions for setting the state in the React component
 */
const getTasksForApplication = async (application, setterObject) => {
  const currentSavedTasksObject = JSON.parse(
    sessionStorage.getItem('taskToApplicationCache')
  );

  if (application in currentSavedTasksObject) {
    setterObject.setTasksForSelectedApplication(
      currentSavedTasksObject[application]
    );
    setterObject.setDisableTaskSelection(false);
  } else {
    const data = await (await fetchTasksFromDB(application)).json();
    currentSavedTasksObject[application] = data;
    sessionStorage.setItem(
      'taskToApplicationCache',
      JSON.stringify(currentSavedTasksObject)
    );
    setterObject.setTasksForSelectedApplication(data);
    setterObject.setDisableTaskSelection(false);
  }
};

/**
 * @description Will check for the given activity, if it has been configured with an application and/or task.
 * This can be used to trigger the disablement of the task dropdown.
 * @param {String} activityId Id of the activity to check for
 * @param {Object} setterObject object containing the functions for setting the state in the React component
 * @returns {Boolean} Boolean if there is an object found and an application has been previously configured
 */
const checkForApplicationTask = (activityId, setterObject) => {
  const currentAttributes = JSON.parse(
    sessionStorage.getItem('attributeLocalStorage')
  );
  const matchingActivity = currentAttributes.find(
    (element) => element.activityId === activityId
  );

  if (matchingActivity) {
    setterObject.setSelectedApplication(matchingActivity.rpaApplication);
    getTasksForApplication(matchingActivity.rpaApplication, setterObject);
  }
  return !!matchingActivity && !!matchingActivity.rpaApplication;
};

/**
 * @description Gets called when a new application was selected in the dropwdown in the sidebar.
 * Updates the state of the component and gets the tasks of the application for the TaskDropdown and clears the TaskDropdown.
 * @param {String} activityId id of the activity for which the change is supposed to happen
 * @param {String} robotId id of the robot to update
 * @param {Object} setterObject object containing the functions for setting the state in the React component
 */
const updateParamSection = (activityId, robotId, setterObject) => {
  setterObject.setOutputVariableName(undefined);
  const paramObj = getParameterObject(robotId, activityId);
  if (paramObj) {
    const paramsInOrder = paramObj.rpaParameters.sort(
      (a, b) => a.index - b.index
    );
    setterObject.setvariableList(paramsInOrder);
    if (paramObj.outputVariable)
      setterObject.setOutputVariableName(paramObj.outputVariable);
  }
};

/**
 * @description Gets called upon a change in the modeler, will update the state with attributes matching the new selection
 * @param {Object} event event telling the newly happened change
 * @param {Object} elementState state of the selected element
 * @param {String} robotId id of the robot which was opened
 * @param {Object} setterObject object containing the functions for setting the state in the React component
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
  setterObject.setOutputVariableName(undefined);
  setterObject.setvariableList([]);

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
 * @description Gets called when the name of the selected element got updated in the sidebar. Updates the state of the component.
 * @param {Object} event changed value in input field
 * @param {Object} modeler the modeling object
 * @param {Object} elementState state of the selected element
 * @param {Object} setterObject object containing the functions for setting the state in the React component
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
 * @description Gets called when a new application was selected in the dropwdown in the sidebar.
 * Updates the state of the component and gets the tasks of the application for the TaskDropdown and clears the TaskDropdown.
 * @param {Object} value new value of the ApplicationDropdown
 * @param {String} robotId id of the robot
 * @param {Object} elementState state of the selected element
 * @param {Object} setterObject object containing the functions for setting the state in the React component
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

  setterObject.setSelectedApplication(value);
  setRpaApplication(robotId, elementState.currentElement.id, value);
  getTasksForApplication(value, setterObject);

  setterObject.setOutputVariableName(undefined);
  setterObject.setvariableList([]);
};

/**
 * @description Gets called when a new task was selected in the dropwdown in the sidebar. Updates the state of the component
 * and gets the parameters of the task and updates the XML RPA properties (adds the application and the task).
 * @param {Object} value new value of the TaskDropdown
 * @param {String} activityId id of the activity selected
 * @param {String} robotId id of the robot
 * @param {String} selectedApplication application selected
 * @param {Object} setterObject object containing the functions for setting the state in the React component
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
 * @description Gets called when the value in a single input field for the parameters has been changed and updates
 * the values in the ssot
 * @param {String} activityId id of the activity selected
 * @param {Object} value new value of input field
 */
const inputParameterChangeHandler = (activityId, value) => {
  setSingleParameter(activityId, value);
};

/**
 * @description Gets called when the name of the output variable has been changed and updates
 * the output variables name in the ssot
 * @param {String} activityId id of the activity selected
 * @param {Object} newValue new value of the output variables name
 */
const outputVarNameChangeHandler = (activityId, newValue) => {
  setOutputValueName(activityId, newValue);
};

export {
  nameChangedHandler,
  applicationChangedHandler,
  taskChangedHandler,
  inputParameterChangeHandler,
  outputVarNameChangeHandler,
  modelerSelectionChangeHandler,
  modelerElementChangeHandler,
  downloadRobotFile,
  onSaveToCloud,
};
