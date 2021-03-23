/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { Typography, Layout, Space, Button } from 'antd';
import PropTypes from 'prop-types'
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';
import styles from './ModelerSidebar.module.css';
import { fetchTasksFromDB } from '../../../api/applicationAndTaskSelection';
import { updateVariablesForRobot } from '../../../api/variableRetrieval'
import getParsedRobotFile from "../../../api/ssot";
import downloadString from '../../../utils/downloadString';
import { setParameter, setRpaApplication, setRpaTask, upsert } from '../../../utils/attributeAndParamUtils';
import parseSsotToBpmn from '../../../utils/ssotToBpmnParsing/ssotToBpmnParsing';

const { Title } = Typography;
const { Sider } = Layout;

/**
 * @description This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * It initializes state based on properties and session storage. It binds all state-methods.
 * @category Client
 * @component
 */
const ModelerSidebar = ({ modeler, robotId }) => {
  // is needed for passing params to sidebar issue
  // eslint-disable-next-line no-unused-vars
  const [variableList, setvariableList] = useState([]);
  const [outputVariableName, setOutputVariableName] = useState();

  const [elementState, setElementState] = useState({
    selectedElements: [],
    currentElement: null,
  });
  // is needed for passing params to sidebar issue
  // eslint-disable-next-line no-unused-vars
  const [selectedApplication, setSelectedApplication] = useState('');
  const [
    tasksForSelectedApplication,
    setTasksForSelectedApplication,
  ] = useState(['']);
  const [disableTaskSelection, setDisableTaskSelection] = useState(true);

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    let ssot = sessionStorage.getItem('ssotLocal');
    ssot = JSON.parse(ssot);
    parseSsotToBpmn(modeler, ssot);
  }, []);

  /**
   * @description Get's called whenever the modeler changed. Either a new element was selected or an element changed or both.
   */
  useEffect(() => {
    modeler.on('selection.changed', (event) => {
      setElementState({
        selectedElements: event.newSelection,
        currentElement: event.newSelection[0],
      });

      // INFO: the updated elementState isn't automatically used in useEffect() therefore we need the following workaround
      elementState.selectedElements = event.newSelection;
      const currentElement = event.newSelection[0];
      elementState.currentElement = currentElement;
      if (
        event.newSelection[0] &&
        !event.newSelection[0].businessObject.$attrs['arkRPA:application']
      ) {
        setDisableTaskSelection(true);
      } else if (
        event.newSelection[0] &&
        event.newSelection[0].businessObject.$attrs['arkRPA:application']
      ) {
        setDisableTaskSelection(false);
      }

      if (event.newSelection[0] && event.newSelection[0].type === 'bpmn:Task') {
        /* TODO: Fixing Issue "pass parameters to sidebar"
        const data = updateParamSection(event.newSelection[0].id)
        setvariableList(data ? data.rpaParameters : []);
        setOutputVariableName(data ? data.outputVariable : null); */
      }
    });

    modeler.on('element.changed', (event) => {
      if (!elementState.currentElement) {
        return;
      }
      if (event.element.id === elementState.currentElement.id) {
        setElementState({
          selectedElements: elementState.selectedElements,
          currentElement: event.element,
        });
      }
    });


  }, [modeler]);

  /**
   * @description Update name in modeler of currently selected element
   * @param {String} name new name for currently selected element
   */
  const updateName = (name) => {
    const modeling = modeler.get('modeling');
    modeling.updateLabel(elementState.currentElement, name);
  };

  /**
   * @description Gets called when a new application was selected in the dropwdown in the sidebar. 
   * Resets the task to default value
   */
  const resetTask = () => {
    setRpaTask(robotId, elementState.currentElement.id, undefined)
    elementState.currentElement.businessObject.$attrs['arkRPA:task'] =
      'Please select task';
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });
  };

  /**
   * @description Checks if tasks for selected application are already stored in session storage.
   * Otherwise, fetch tasklist from MongoDB.
   * @param {String} application Application for which to get the tasks for.
   */
  const getTasksForApplication = async (application) => {
    const currentSavedTasksObject = JSON.parse(
      sessionStorage.getItem('taskToApplicationCache')
    );

    if (application in currentSavedTasksObject) {
      setTasksForSelectedApplication(currentSavedTasksObject[application]);
      // TODO FIX DROPDOWN BUG HERE
      setDisableTaskSelection(false);
    } else {
      fetchTasksFromDB(application)
        .then((response) => response.json())
        .then((data) => {
          currentSavedTasksObject[application] = data;
          sessionStorage.setItem(
            'taskToApplicationCache',
            JSON.stringify(currentSavedTasksObject)
          );
          setTasksForSelectedApplication(data);
          setDisableTaskSelection(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  /**
   * @description Gets called when the name of the selected element got updated in the sidebar. Updates the state of the component.
   * @param {Object} event changed value in input field
   */
  const nameChangedHandler = (event) => {
    elementState.currentElement.businessObject.name = event.target.value;
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });
    updateName(elementState.currentElement.businessObject.name);
  };

  /**
   * @description Gets called when a new application was selected in the dropwdown in the sidebar. 
   * Updates the state of the component and gets the tasks of the application for the TaskDropdown and clears the TaskDropdown.
   * @param {Object} value new value of the ApplicationDropdown
   */
  const applicationChangedHandler = (value) => {
    elementState.currentElement.businessObject.$attrs[
      'arkRPA:application'
    ] = value;
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });
    if (value) {
      setRpaApplication(robotId, elementState.currentElement.id, value)
    }
    setSelectedApplication(value);
    resetTask()
    getTasksForApplication(value);
  };

  /**
   * @description Will update the parameters and output variable in the state for the given activity
   * @param {String} activityId Id of the activity to process
 */
  const updateParamSection = (activityId) =>
    /* this part of code is WIP for implementing the param section
    const localAttributeObject = JSON.parse(sessionStorage.getItem('attributeLocalStorage'));
    const localParameterObject = JSON.parse(sessionStorage.getItem('parameterLocalStorage'));
    const localTaskAplicationCombination = JSON.parse(sessionStorage.getItem('TaskApplicationCombinations'));

    const matchingActivity = localAttributeObject.find((element) => (element.activityId === activityId));
    const matchingParameterObject = localParameterObject.find((element) => (element.activityId === activityId));

    if (matchingParameterObject) {
      const matchingCombination = localTaskAplicationCombination.find((element) => (element.Application === matchingActivity.rpaApplication && element.Task === matchingActivity.rpaTask));
      const copy = matchingParameterObject;
      copy.rpaParameters.forEach((element) => delete element.value)
      matchingCombination.inputVars.forEach((element) => copy.rpaParameters.includes(element))
      return matchingParameterObject;
    }


    // const matchingParameterObject = localParameterObject.find((element) => (element.activityId === activityId && element.matchingActivity.rpaApplication));
    if (matchingParameterObject) {
      return matchingParameterObject
    }

    const inputVars = [];
    matchingCombination.inputVars.forEach((singleVar) => {
      const varWithValue = singleVar;
      varWithValue.value = '';
      inputVars.push(varWithValue);
    });
    const outputVariable = matchingCombination.outputValue ? `${activityId}_output` : null;
    const newParameterObject = {
      ssotId: robotId,
      activityId,
      outputVariable,
      rpaParameters: inputVars
    }
    localParameterObject.push(newParameterObject);
    sessionStorage.setItem('parameterLocalStorage', JSON.stringify(localParameterObject));
    return newParameterObject; */
    activityId
    ;


  /**
   * @description Gets called when a new task was selected in the dropwdown in the sidebar. Updates the state of the component
   * and gets the parameters of the task and updates the XML RPA properties (adds the application and the task).
   * @param {Object} value new value of the TaskDropdown
   */
  const taskChangedHandler = (value) => {
    setRpaTask(robotId, elementState.currentElement.id, value);
    /* TODO: Fixing Issue "pass parameters to sidebar"
    const modeling = modeler.get('modeling');
    */
    updateParamSection()
  };

  /**
   * @description Gets called when the value in a single input field for the parameters has been changed and updates
   * the values in the SSOT
   * @param {Object} value new value of input field
   */
  const handleInputParameterChange = (value) => {
    setParameter(robotId, elementState.currentElement.id, undefined)
    const variableName = value.target.placeholder;
    const variableValue = value.target.value;
    const editedVariableList = [];
    variableList.forEach((singleVariable) => {
      const variableToAdd = singleVariable;
      if (variableToAdd.name === variableName) {
        variableToAdd.value = variableValue;
      }
      editedVariableList.push(variableToAdd);
    })

    updateVariablesForRobot(
      robotId,
      elementState.currentElement.businessObject.id,
      editedVariableList,
      outputVariableName
    );
  };

  /**
   * @description Gets called when the name of the output variable has been changed and updates
   * the output variables name in the SSOT
   * @param {Object} newValue new value of the output variables name
   */
  const handleOutputVarNameChange = (newValue) => {
    setOutputVariableName(newValue);
    updateVariablesForRobot(
      robotId,
      elementState.currentElement.businessObject.id,
      variableList,
      newValue
    );
  };

  /**
   * @description Will parse a given xml file into a .robot file and download it
   * @param {string} xml String that sets the xml to be parsed
   */
  const downloadRobotFile = () => {
    getParsedRobotFile(robotId)
      .then((response) => response.text())
      .then((robotCode) => {
        downloadString(robotCode, 'text/robot', 'testRobot.robot');
      });
  };

  return (
    <Sider className={styles.sider}>
      <Space direction='vertical' size='small' style={{ width: '100%' }}>
        <Title level={3} className={styles.title}>
          {sessionStorage.getItem('robotName')}
        </Title>
        {elementState.selectedElements.length === 1 && (
          <PropertiesPanel
            nameChanged={nameChangedHandler.bind(this)}
            applicationSelectionUpdated={applicationChangedHandler.bind(
              this
            )}
            taskSelectionUpdated={taskChangedHandler.bind(this)}
            selectedActivity={elementState.currentElement.id}
            tasksForSelectedApplication={tasksForSelectedApplication}
            disableTaskSelection={disableTaskSelection}
            element={elementState.currentElement}
            robotId={robotId}
            variableList={variableList}
            parameterSelectionUpdated={handleInputParameterChange.bind(this)}
            outputVariableName={outputVariableName}
            outputNameUpdated={handleOutputVarNameChange}
          />
        )}

        {elementState.selectedElements.length === 0 && (
          <Title level={4} className={styles.title}>
            Please select an element.
          </Title>
        )}

        {elementState.selectedElements.length > 1 && (
          <Title level={4} className={styles.title}>
            Please select a single element.
          </Title>
        )}
        <Button type='primary' className={styles.button} onClick={downloadRobotFile}>
          Get Robot file
        </Button>
        <Button type='primary' className={styles.button} onClick={upsert()}>
          Save changes to cloud
        </Button>
      </Space>
    </Sider>
  );
};

ModelerSidebar.propTypes = {
  modeler: PropTypes.objectOf(PropTypes.shape).isRequired,
  robotId: PropTypes.string.isRequired,
};

export default ModelerSidebar;
