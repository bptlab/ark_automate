/* eslint-disable no-param-reassign */

/**
 * @category Client
 * @module
 */

import { fetchTasksFromDB } from '../../api/applicationAndTaskSelection';
/* import { fetchTasksFromDB } from '../../../api/applicationAndTaskSelection';
 */
import { setRpaTask, setRpaApplication } from '../localSsot/attributes';
import {
  setSingleParameter,
  setOutputValueName,
  getParameterObject,
} from '../localSsot/parameters';

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

  setterObject.setOutputValueName(undefined);
  setterObject.setParameterList([]);
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
 * @description Gets called when the name of the output value has been changed and updates
 * the output values name in the ssot
 * @param {String} activityId id of the activity selected
 * @param {Object} newValue new value of the output values name
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
};
