import React, { useState, useEffect } from 'react';
import PropertiesPanelView from './PropertiesPanelView/PropertiesPanelView';
import './PropertiesPanel.css';
import { fetchTaskParametersAndUpdateRPAProperties } from '../../../utils/xmlUtils';
import {
  fetchTasksFromDB,
  getAvailableApplications,
} from '../../../api/rpaFramework';
import { Typography } from 'antd';

const { Title } = Typography;

/**
 * @component
 * @description This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * @description Initializes state based on properties; initializes session storage. Binds all state-methods.
 */
const PropertiesPanel = (props) => {
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

  useEffect(() => {
    initSessionStorage('TaskToApplicationCache', JSON.stringify({}));
    initSessionStorage('AvailableApplications', []);
    let applicationList = sessionStorage.getItem('AvailableApplications');
    if (applicationList.length < 1) saveAvailableApplicationsToSessionStorage();
  }, []);

  useEffect(() => {
    props.modeler.on('selection.changed', (event) => {
      setElementState({
        selectedElements: event.newSelection,
        currentElement: event.newSelection[0],
      });
      elementState.selectedElements = event.newSelection;
      elementState.currentElement = event.newSelection[0];
      if (
        event.newSelection[0] &&
        !event.newSelection[0].businessObject['$attrs']['arkRPA:application']
      ) {
        setDisableTaskSelection(true);
      } else if (
        event.newSelection[0] &&
        event.newSelection[0].businessObject['$attrs']['arkRPA:application']
      ) {
        setDisableTaskSelection(false);
      }
    });

    props.modeler.on('element.changed', (event) => {
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
  }, [props.modeler]);

  /**
   * @description Checks if passed item already exists in session storage and initializes with given value if not existing.
   * @param {*} itemToCheckFor The selected item to check for in the session storage.
   * @param {*} valueToInitTo The value to init to if the item is not existing in session storage yet.
   */
  const initSessionStorage = (itemToCheckFor, valueToInitTo) => {
    if (sessionStorage.getItem(itemToCheckFor) === null)
      sessionStorage.setItem(itemToCheckFor, valueToInitTo);
  };

  /**
   * @description Update name in modeler of currently selected element
   */
  const updateName = (name) => {
    const modeling = props.modeler.get('modeling');
    modeling.updateLabel(elementState.currentElement, name);
  };

  /**
   * @description Fetch all applications from MongoDB and save in session storage.
   */
  const saveAvailableApplicationsToSessionStorage = async () => {
    getAvailableApplications()
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('AvailableApplications', data);
      });
  };

  /**
   * @description
   * Checks if tasks for selected application are already stored in session storage.
   * Otherwise, fetch tasklist from MongoDB.
   * @param {*} selectedApplication Application for which to get the tasks for.
   */
  const getTasksForApplication = async (selectedApplication) => {
    let currentSavedTasksObject = JSON.parse(
      sessionStorage.getItem('TaskToApplicationCache')
    );

    if (selectedApplication in currentSavedTasksObject) {
      setTasksForSelectedApplication(
        currentSavedTasksObject[selectedApplication]
      );
      setDisableTaskSelection(false);
    } else {
      fetchTasksFromDB(selectedApplication)
        .then((response) => response.json())
        .then((data) => {
          currentSavedTasksObject[selectedApplication] = data;
          sessionStorage.setItem(
            'TaskToApplicationCache',
            JSON.stringify(currentSavedTasksObject)
          );
          setTasksForSelectedApplication(data);
          setDisableTaskSelection(false);
        });
    }
  };

  //Handler functions
  const nameChangedHandler = (event) => {
    elementState.currentElement.businessObject.name = event.target.value;
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });
    updateName(elementState.currentElement.businessObject.name);
  };

  const selectApplicationUpdatedHandler = (value) => {
    elementState.currentElement.businessObject['$attrs'][
      'arkRPA:application'
    ] = value;
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });
    setSelectedApplication(value);
    getTasksForApplication(value);
  };

  const selectTaskUpdatedHandler = (value) => {
    const modeling = props.modeler.get('modeling');
    fetchTaskParametersAndUpdateRPAProperties(
      selectedApplication,
      value,
      modeling,
      elementState.currentElement
    );
  };

  return (
    <div className='sidebarWrapper'>
      {elementState.selectedElements.length === 1 && (
        <PropertiesPanelView
          nameChanged={nameChangedHandler.bind(this)}
          applicationSelectionUpdated={selectApplicationUpdatedHandler.bind(
            this
          )}
          taskSelectionUpdated={selectTaskUpdatedHandler.bind(this)}
          tasksForSelectedApplication={tasksForSelectedApplication}
          disableTaskSelection={disableTaskSelection}
          element={elementState.currentElement}
        />
      )}

      {elementState.selectedElements.length === 0 && (
        <span>
          <Title className='label-on-dark-background'>
            Please select an element.
          </Title>
        </span>
      )}

      {elementState.selectedElements.length > 1 && (
        <span>
          <Title className='label-on-dark-background'>
            Please select a single element.
          </Title>
        </span>
      )}
    </div>
  );
};
export default PropertiesPanel;
