import React, { useState, useEffect } from 'react';
import PropertiesPanelView from './PropertiesPanelView/PropertiesPanelView';
import './PropertiesPanel.css';
import fetchTaskParametersAndUpdateRPAProperties from '../../../utils/xmlUtils';
import {
  fetchTasksFromDB,
  getAvailableApplications,
} from '../../../api/rpaFramework';
import { Typography } from 'antd';

const { Title } = Typography;

/**
 * @description This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * It initializes state based on properties and session storage. It binds all state-methods.
 * @category Client
 * @component
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

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    initSessionStorage('TaskToApplicationCache', JSON.stringify({}));
    initSessionStorage('AvailableApplications', []);
    let applicationList = sessionStorage.getItem('AvailableApplications');
    if (applicationList.length < 1) saveAvailableApplicationsToSessionStorage();
  }, []);

  /**
   * @description Get's called whenever the modeler changed. Either a new element was selected or an element changed or both.
   */
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
   * @param {String} name new name for currently selected element
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Checks if tasks for selected application are already stored in session storage.
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

  /**
   * @description Gets called when a new task was selected in the dropwdown in the sidebar. Updates the state of the component
   * and gets the parameters of the task and updates the XML RPA properties (adds the application and the task).
   * @param {Object} value new value of the TaskDropdown
   */
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
