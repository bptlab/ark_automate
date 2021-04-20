/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { Typography, Layout, Space, Button } from 'antd';
import PropTypes from 'prop-types';
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';
import styles from './ModelerSidebar.module.css';
import parseSsotToBpmn from '../../../utils/ssotToBpmnParsing/ssotToBpmnParsing';
import {
  nameChangedHandler,
  applicationChangedHandler,
  taskChangedHandler,
  handleInputParameterChange,
  handleOutputVarNameChange,
  downloadRobotFile,
  onSaveToCloud,
  onModelerSelectionChange,
  onModelerElementChanged,
} from '../../../utils/sidebarFunctionality';

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
  const stateSetters = {
    setvariableList,
    setOutputVariableName,
    setElementState,
    setSelectedApplication,
    setTasksForSelectedApplication,
    setDisableTaskSelection,
  };

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
      onModelerSelectionChange(event, elementState, robotId, stateSetters);
    });

    modeler.on('element.changed', (event) => {
      onModelerElementChanged(event, elementState, stateSetters);
    });
  }, [modeler]);

  return (
    <Sider className={styles.sider}>
      <Space direction='vertical' size='small' style={{ width: '100%' }}>
        <Title level={3} className={styles.title}>
          {sessionStorage.getItem('robotName')}
        </Title>
        {elementState.selectedElements.length === 1 && (
          <PropertiesPanel
            nameChanged={(event) => {
              nameChangedHandler(event, modeler, elementState, stateSetters);
            }}
            applicationSelectionUpdated={(value) => {
              applicationChangedHandler(
                value,
                robotId,
                elementState,
                stateSetters
              );
            }}
            taskSelectionUpdated={(value) => {
              taskChangedHandler(
                value,
                elementState.currentElement.id,
                robotId,
                selectedApplication,
                stateSetters
              );
            }}
            selectedActivity={elementState.currentElement.id}
            tasksForSelectedApplication={tasksForSelectedApplication}
            disableTaskSelection={disableTaskSelection}
            element={elementState.currentElement}
            robotId={robotId}
            variableList={variableList}
            parameterSelectionUpdated={(newValue) => {
              handleInputParameterChange(
                elementState.currentElement.id,
                newValue
              );
            }}
            outputVariableName={outputVariableName}
            outputNameUpdated={(newValue) => {
              handleOutputVarNameChange(
                elementState.currentElement.id,
                newValue
              );
            }}
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
          onClick={() => {
            downloadRobotFile(robotId);
          }}
        >
          Get Robot file
        </Button>
        <Button
          type='primary'
          className={styles.button}
          onClick={() => {
            onSaveToCloud(modeler, robotId);
          }}
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
