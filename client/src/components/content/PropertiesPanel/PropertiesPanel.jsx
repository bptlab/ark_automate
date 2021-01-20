import React, { Component } from 'react';
import PropertiesPanelView from './PropertiesPanelView/PropertiesPanelView';
import './PropertiesPanel.css';

import { Typography } from 'antd';

const { Title } = Typography;
const activityDataRetrieval = require('../../../utils/xmlUtils');

/**
 * @functional
 * @component
 * @description This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * @description Initializes state based on properties; initializes session storage. Binds all state-methods.
 */

export default class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedElements: [],
      element: null,
      selectedApplication: '',
      tasksForSelectedApplication: [''],
      disableTaskSelection: true,
    };
    console.log('constructing...');
    console.log('initialState: ', this.state);
    this.initSessionStorage('TaskToApplicationCache', JSON.stringify({}));
    this.initSessionStorage('AvailableApplications', []);
  }

  /**
   * @description
   * On a changed selection, the selected element changed in the components state.
   * We also update panel via .setState, if currently selected element changed.
   */
  componentDidMount() {
    let applicationList = sessionStorage.getItem('AvailableApplications');
    if (applicationList.length < 1)
      this.saveAvailableApplicationsToSessionStorage();
    this.checkForExistingRPAAttributes();

    const { modeler } = this.props;

    modeler.on('selection.changed', (event) => {
      console.log('Selection changed...');
      console.log('newSelection', event.newSelection[0]);
      this.setState({
        selectedElements: event.newSelection,
        element: event.newSelection[0],
      });
      console.log('thisState', this.state);
    });

    modeler.on('element.changed', (event) => {
      const { element } = event;
      const { element: currentElement } = this.state;
      console.log(element);
      console.log(this.state);
      if (!currentElement) {
        return;
      }
      if (element.id === currentElement.id) {
        this.setState({
          element: element,
        });
      }
    });
  }

  /**
   * @description gets called each time the Component is mounted to ensure that if an
   * element already has an app and Task selected, those will be displayed
   */
  checkForExistingRPAAttributes() {
    let { element } = this.state;
    if (element) {
      if (element.businessObject['$attrs']['arkRPA:application'])
        this.getTasksForApplication(
          element.businessObject['$attrs']['arkRPA:application']
        );

      if (
        !element.businessObject['$attrs']['arkRPA:application'] &&
        this.state['disableTaskSelection']
      ) {
        this.setState({ disableTaskSelection: true });
      } else {
        this.setState({ disableTaskSelection: false });
      }
    }
  }

  /**
   * @description Checks if passed item already exists in session storage and initializes with given value if not existing.
   * @param {*} itemToCheckFor The selected item to check for in the session storage.
   * @param {*} valueToInitTo The value to init to if the item is not existing in session storage yet.
   */
  initSessionStorage(itemToCheckFor, valueToInitTo) {
    if (sessionStorage.getItem(itemToCheckFor) === null)
      sessionStorage.setItem(itemToCheckFor, valueToInitTo);
  }

  updateName(name) {
    const modeling = this.props.modeler.get('modeling');
    let { element } = this.state;
    modeling.updateLabel(element, name);
  }

  /**
   * @description Fetch all applications from MongoDB and save in session storage.
   */
  async saveAvailableApplicationsToSessionStorage() {
    await fetch('/rpa-framework/commands/get-available-applications')
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('AvailableApplications', data);
      });
  }

  /**
   * @description
   * Checks if tasks for selected application are already stored in session storage.
   * Otherwise, fetch tasklist from MongoDB.
   * @param {*} selectedApplication Application for which to get the tasks for.
   */
  async getTasksForApplication(selectedApplication) {
    let currentSavedTasksObject = JSON.parse(
      sessionStorage.getItem('TaskToApplicationCache')
    );

    if (selectedApplication in currentSavedTasksObject) {
      this.setState({
        tasksForSelectedApplication:
          currentSavedTasksObject[selectedApplication],
        disableTaskSelection: false,
      });
    } else {
      this.fetchTasksFromDB(selectedApplication, currentSavedTasksObject);
    }
  }
  /**
   * @description Fetch tasklist from Mongo-DB and set state to force rerendering.
   * @param {String} selectedApplication - String with currently selected application from Dropdown
   * @param {Object} currentSavedTasksObject - Object with all applications and tasks as attributes
   */
  async fetchTasksFromDB(selectedApplication, currentSavedTasksObject) {
    await fetch(
      '/rpa-framework/commands/get-available-tasks-for-application?application=' +
        selectedApplication.replaceAll(' ', '+')
    )
      .then((response) => response.json())
      .then((data) => {
        currentSavedTasksObject[selectedApplication] = data;
        sessionStorage.setItem(
          'TaskToApplicationCache',
          JSON.stringify(currentSavedTasksObject)
        );

        this.setState({
          tasksForSelectedApplication: data,
          disableTaskSelection: false,
        });
      });
  }

  //Handler functions
  nameChangedHandler(event) {
    const element = this.state.element;
    element.businessObject.name = event.target.value;
    this.setState({ element: element });
    this.updateName(element.businessObject.name);
  }

  selectApplicationUpdatedHandler(value) {
    const element = this.state.element;
    element.businessObject['$attrs']['arkRPA:application'] = value;
    this.setState({
      element: element,
      selectedApplication: value,
    });
    this.getTasksForApplication(value);
  }

  selectTaskUpdatedHandler(value) {
    const element = this.state.element;
    element.businessObject['$attrs']['arkRPA:task'] = value;
    this.setState({ element: element, selectedTask: value }, () => {
      const modeling = this.props.modeler.get('modeling');
      let { element } = this.state;
      activityDataRetrieval.fetchAndUpdateRPAProperties(
        this.state['selectedApplication'],
        value,
        modeling,
        element
      );
    });
  }
  updatedToServiceTaskHandler(name) {
    const bpmnReplace = this.props.modeler.get('bpmnReplace');

    let { element } = this.state;
    bpmnReplace.replaceElement(element, {
      type: 'bpmn:ServiceTask',
    });
  }

  render() {
    const { modeler } = this.props;
    const { selectedElements, element } = this.state;

    return (
      <div className='sidebarWrapper'>
        {selectedElements.length === 1 && (
          <PropertiesPanelView
            nameChanged={this.nameChangedHandler.bind(this)}
            applicationSelectionUpdated={this.selectApplicationUpdatedHandler.bind(
              this
            )}
            taskSelectionUpdated={this.selectTaskUpdatedHandler.bind(this)}
            updatedToServiceTask={this.updatedToServiceTaskHandler.bind(this)}
            tasksForSelectedApplication={this.state.tasksForSelectedApplication}
            disableTaskSelection={this.state.disableTaskSelection}
            element={this.state.element}
          />
        )}

        {selectedElements.length === 0 && (
          <span>
            <Title className='label-on-dark-background'>
              Please select an element.
            </Title>
          </span>
        )}

        {selectedElements.length > 1 && (
          <span>
            <Title className='label-on-dark-background'>
              Please select a single element.
            </Title>
          </span>
        )}
      </div>
    );
  }
}
