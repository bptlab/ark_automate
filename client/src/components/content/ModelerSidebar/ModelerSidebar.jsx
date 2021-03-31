/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { Typography, Layout, Space, Button } from 'antd';
import PropTypes from 'prop-types';
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';
import styles from './ModelerSidebar.module.css';
import { fetchTasksFromDB } from '../../../api/applicationAndTaskSelection';
import getParsedRobotFile from '../../../api/ssot';
import downloadString from '../../../utils/downloadString';
import {
  setSingleParameter,
  resetRpaApplication,
  setRpaTask,
  upsert,
  getParameterObject,
  setOutputValueName,
} from '../../../utils/attributeAndParamUtils';
import parseSsotToBpmn from '../../../utils/ssotToBpmnParsing/ssotToBpmnParsing';
import parseBpmnToSsot from '../../../utils/BpmnToSsotParsing/BpmnToSsotParsing';

const { Title } = Typography;
const { Sider } = Layout;

/**
 * @description This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * It initializes state based on properties and session storage. It binds all state-methods.
 * @category Client
 * @component
 */
const ModelerSidebar = ({ modeler, robotId }) => {
  const [variableList, setvariableList] = useState([]);
  const [outputVariableName, setOutputVariableName] = useState();

  const [elementState, setElementState] = useState({
    selectedElements: [],
    currentElement: null,
  });
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
   * @description Will check for the given activity, if it has been configured with an application and/or task.
   * This can be used to trigger the disablement of the task dropdown.
   * @returns {Boolean} Boolean if there is an object found and an application has been previously configured
   */
  const checkForApplicationTask = (activityId) => {
    const currentAttributes = JSON.parse(
      sessionStorage.getItem('attributeLocalStorage')
    );
    const matchingActivity = currentAttributes.find(
      (element) => element.activityId === activityId
    );

    if (matchingActivity) {
      setSelectedApplication(matchingActivity.rpaApplication);
      getTasksForApplication(matchingActivity.rpaApplication);
    }
    return !!matchingActivity && !!matchingActivity.rpaApplication;
  };

  /**
   * @description Gets called when a new application was selected in the dropwdown in the sidebar.
   * Updates the state of the component and gets the tasks of the application for the TaskDropdown and clears the TaskDropdown.
   * @param {Object} value new value of the ApplicationDropdown
   */
  const updateParamSection = (activityId) => {
    setOutputVariableName(undefined);
    const paramObj = getParameterObject(robotId, activityId);
    if (paramObj) {
      const paramsInOrder = paramObj.rpaParameters.sort(
        (a, b) => a.index - b.index
      );
      setvariableList(paramsInOrder);
      if (paramObj.outputVariable)
        setOutputVariableName(paramObj.outputVariable);
    }
  };

  /**
   * @description Get's called whenever the modeler changed. Either a new element was selected or an element changed or both.
   */
  useEffect(() => {
    modeler.on('selection.changed', (event) => {
      setElementState({
        selectedElements: event.newSelection,
        currentElement: event.newSelection[0],
      });
      setOutputVariableName(undefined);
      setvariableList([]);

      // INFO: the updated elementState isn't automatically used in useEffect() therefore we need the following workaround
      elementState.selectedElements = event.newSelection;
      const currentElement = event.newSelection[0];
      elementState.currentElement = currentElement;

      if (event.newSelection[0] && event.newSelection[0].type === 'bpmn:Task') {
        setDisableTaskSelection(
          !checkForApplicationTask(event.newSelection[0].id)
        );

        const localAttributeStorage = JSON.parse(
          sessionStorage.getItem('attributeLocalStorage')
        );
        const matchingAttributeObject = localAttributeStorage.find(
          (element) => element.activityId === event.newSelection[0].id
        );
        if (matchingAttributeObject)
          updateParamSection(event.newSelection[0].id);
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
   * @description Gets called when the name of the selected element got updated in the sidebar. Updates the state of the component.
   * @param {Object} event changed value in input field
   */
  const nameChangedHandler = (event) => {
    elementState.currentElement.businessObject.name = event.target.value;
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });
    const modeling = modeler.get('modeling');
    modeling.updateLabel(elementState.currentElement, event.target.value);
  };

  /**
   * @description Gets called when a new application was selected in the dropwdown in the sidebar.
   * Updates the state of the component and gets the tasks of the application for the TaskDropdown and clears the TaskDropdown.
   * @param {Object} value new value of the ApplicationDropdown
   */
  const applicationChangedHandler = (value) => {
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });

    setSelectedApplication(value);
    resetRpaApplication(robotId, elementState.currentElement.id, value);
    getTasksForApplication(value);

    setOutputVariableName(undefined);
    setvariableList([]);
  };

  /**
   * @description Gets called when a new task was selected in the dropwdown in the sidebar. Updates the state of the component
   * and gets the parameters of the task and updates the XML RPA properties (adds the application and the task).
   * @param {Object} value new value of the TaskDropdown
   */
  const taskChangedHandler = (value) => {
    setRpaTask(
      robotId,
      elementState.currentElement.id,
      selectedApplication,
      value
    );
    if (value) updateParamSection(elementState.currentElement.id);
  };

  /**
   * @description Gets called when the value in a single input field for the parameters has been changed and updates
   * the values in the ssot
   * @param {Object} value new value of input field
   */
  const handleInputParameterChange = (value) => {
    setSingleParameter(elementState.currentElement.id, value);
  };

  /**
   * @description Gets called when the name of the output variable has been changed and updates
   * the output variables name in the ssot
   * @param {Object} newValue new value of the output variables name
   */
  const handleOutputVarNameChange = (newValue) => {
    setOutputValueName(elementState.currentElement.id, newValue);
  };

  /**
   * @description Gets called when the the button is pressed to save to the cloud.
   * This function will retrieve the xml from the parser, parse that xml to a ssot and write the
   * resulting ssot into the sessionStorage.
   */
  const onSaveToCloud = async () => {
    modeler
      .saveXML({ format: true })
      .then((xml) => {
        parseBpmnToSsot(xml, robotId).then((result) => {
          const ssot = JSON.stringify(result);
          sessionStorage.setItem('ssotLocal', ssot);

          upsert();
        });
      })
      .catch((err) => console.error(err));
  };

  /**
   * @description Will parse the ssot which can be found in the database correlating to the specified id
   * @param {string} xml String that sets the xml to be parsed
   */
  const downloadRobotFile = () => {
    getParsedRobotFile(robotId)
      .then((response) => response.text())
      .then((robotCode) => {
        const fileName = `${sessionStorage.getItem('robotName')}.robot`;
        downloadString(robotCode, 'text/robot', fileName);
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
            nameChanged={nameChangedHandler}
            applicationSelectionUpdated={applicationChangedHandler}
            taskSelectionUpdated={taskChangedHandler}
            selectedActivity={elementState.currentElement.id}
            tasksForSelectedApplication={tasksForSelectedApplication}
            disableTaskSelection={disableTaskSelection}
            element={elementState.currentElement}
            robotId={robotId}
            variableList={variableList}
            parameterSelectionUpdated={handleInputParameterChange}
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
        <Button
          type='primary'
          className={styles.button}
          onClick={downloadRobotFile}
        >
          Get Robot file
        </Button>
        <Button
          type='primary'
          className={styles.button}
          onClick={onSaveToCloud}
        >
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
