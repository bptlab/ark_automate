/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import PropertiesPanelView from './PropertiesPanelView/PropertiesPanelView';
import styles from './PropertiesPanel.module.css';
import fetchTaskParametersAndUpdateRPAProperties from '../../../utils/xmlUtils';
import {
  fetchTasksFromDB,
  getAvailableApplications,
} from '../../../api/applicationAndTaskSelection';

const { Title } = Typography;

/**
 * @description This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * It initializes state based on properties and session storage. It binds all state-methods.
 * @category Client
 * @component
 */
const PropertiesPanel = ({ modeler }) => {
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
    initSessionStorage('TaskToApplicationCache', JSON.stringify({}));
    initSessionStorage('AvailableApplications', []);
    const applicationList = sessionStorage.getItem('AvailableApplications');
    if (applicationList.length < 1) saveAvailableApplicationsToSessionStorage();
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

      // the updated elementState isn't automatically used in useEffect() therefore we need the following workaround
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
   * @param {String} name new name for currently selected element
   */
  const updateName = (name) => {
    const modeling = modeler.get('modeling');
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Checks if tasks for selected application are already stored in session storage.
   * Otherwise, fetch tasklist from MongoDB.
   * @param {*} application Application for which to get the tasks for.
   */
  const getTasksForApplication = async (application) => {
    const currentSavedTasksObject = JSON.parse(
      sessionStorage.getItem('TaskToApplicationCache')
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
            'TaskToApplicationCache',
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
   * @description Gets called when a new application was selected in the dropwdown in the sidebar. Updates the state of the component
   * and gets the tasks of the application for the TaskDropdown and clears the TaskDropdown.
   * @param {Object} value new value of the ApplicationDropdown
   */
  const selectApplicationUpdatedHandler = (value) => {
    elementState.currentElement.businessObject.$attrs[
      'arkRPA:application'
    ] = value;
    setElementState({
      selectedElements: elementState.selectedElements,
      currentElement: elementState.currentElement,
    });
    setSelectedApplication(value);
    getTasksForApplication(value);
  };

  /**
   * @description Gets called when a new task was selected in the dropwdown in the sidebar. Updates the state of the component
   * and gets the parameters of the task and updates the XML RPA properties (adds the application and the task).
   * @param {Object} value new value of the TaskDropdown
   */
  const selectTaskUpdatedHandler = (value) => {
    const modeling = modeler.get('modeling');
    fetchTaskParametersAndUpdateRPAProperties(
      selectedApplication,
      value,
      modeling,
      elementState.currentElement
    );
  };

  return (
    <div>
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
          <Title level={4} className={styles.title}>
            Please select an element.
          </Title>
        </span>
      )}

      {elementState.selectedElements.length > 1 && (
        <span>
          <Title level={4} className={styles.title}>
            Please select a single element.
          </Title>
        </span>
      )}
    </div>
  );
};
export default PropertiesPanel;
