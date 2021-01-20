import { is } from 'bpmn-js/lib/util/ModelUtil';

import React, { Component } from 'react';
import { Button, Input, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined, RobotOutlined } from '@ant-design/icons';
import PropertiesPanelApplicationDropdown from '../PropertiesPanelApplicationDropdown/PropertiesPanelApplicationDropdown';
import PropertiesPanelTaskDropdown from '../PropertiesPanelTaskDropdown/PropertiesPanelTaskDropdown';


import '../PropertiesView/PropertiesView.css';

const activityDataRetrieval = require('../../../../utils/xmlUtils');

const { Text } = Typography;

/**
 * @class
 * @component
 * @classdesc Builds PropertiesPanel for one selected BPMN-Element.
 * @example return (<PropertiesPanelBuilder />)
 *
 * @description Initializes state based on properties; initializes session storage. Binds all state-methods.
 */
export default class PropertiesPanelBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      element: props.element,
      modeler: props.modeler,
      selectedApplication: '',
      tasksForSelectedApplication: [''],
      disableTaskSelection: true,
    };

    const { element } = this.state;
    if (element.labelTarget) {
      this.setState({
        element: element.labelTarget,
      });
    }

    this.updateSelectedApplication = this.updateSelectedApplication.bind(this);
    this.updateSelectedTask = this.updateSelectedTask.bind(this);
    this.makeServiceTask = this.makeServiceTask.bind(this);

    this.initSessionStorage('TaskToApplicationCache', JSON.stringify({}));
    this.initSessionStorage('AvailableApplications', []);
  }



  /**
   * @description
   * Checks if available application list hast just been initialized
   * or already populated with values and does so if not done yet.
   */
  componentDidMount() {
    const applicationList = sessionStorage.getItem('AvailableApplications');
    if (applicationList.length < 1)
      this.saveAvailableApplicationsToSessionStorage();

    this.checkForExistingRPAAttributes();
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
    const currentSavedTasksObject = JSON.parse(
      sessionStorage.getItem('TaskToApplicationCache')
    );

    if (selectedApplication in currentSavedTasksObject) {
      this.setState({
        selectedApplication,
        tasksForSelectedApplication:
          currentSavedTasksObject[selectedApplication],
        disableTaskSelection: false,
      });
    } else {
      this.fetchTasksFromDB(selectedApplication, currentSavedTasksObject);
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

  /**
   * @description gets called each time the Component is mounted to ensure that if an
   * element already has an app and Task selected, those will be displayed
   */
  checkForExistingRPAAttributes() {
    const { element } = this.state;
    if (element.businessObject.$attrs['arkRPA:application'])
      this.getTasksForApplication(
        element.businessObject.$attrs['arkRPA:application']
      );

    if (
      !element.businessObject.$attrs['arkRPA:application'] &&
      this.state.disableTaskSelection
    ) {
      this.setState({ disableTaskSelection: true });
    } else {
      this.setState({ disableTaskSelection: false });
    }
  }

  /**
   * @description Fetch tasklist from Mongo-DB and set state to force rerendering.
   * @param {String} selectedApplication - String with currently selected application from Dropdown
   * @param {Object} currentSavedTasksObject - Object with all applications and tasks as attributes
   */
  async fetchTasksFromDB(selectedApplication, currentSavedTasksObject) {
    await fetch(
      `/rpa-framework/commands/get-available-tasks-for-application?application=${ 
        selectedApplication.replaceAll(' ', '+')}`
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

  updateName(name) {
    const modeling = this.state.modeler.get('modeling');
    const { element } = this.state;
    modeling.updateLabel(element, name);
  }

  updateTopic(topic) {
    const modeling = this.state.modeler.get('modeling');

    const { element } = this.state;
    modeling.updateProperties(element, {
      'custom:topic': topic,
    });
  }

  updateSelectedApplication(value) {
    this.setState(
      {
        selectedApplication: value,
      },
      () => this.getTasksForApplication(value)
    );
  }

  updateSelectedTask(value) {
    this.setState(
      {
        selectedTask: value,
      },
      () => {
        const modeling = this.state.modeler.get('modeling');
        const { element } = this.state;
        activityDataRetrieval.fetchAndUpdateRPAProperties(
          this.state.selectedApplication,
          value,
          modeling,
          element
        );
      }
    );
  }

  makeServiceTask() {
    const bpmnReplace = this.state.modeler.get('bpmnReplace');

    const { element } = this.state;
    bpmnReplace.replaceElement(element, {
      type: 'bpmn:ServiceTask',
    });
  }

  attachTimeout() {
    const modeling = this.state.modeler.get('modeling');
    const selection = this.state.modeler.get('selection');

    const { element } = this.state;
    const attrs = {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
    };

    const position = {
      x: element.x + element.width,
      y: element.y + element.height,
    };

    const boundaryEvent = modeling.createShape(attrs, position, element, {
      attach: true,
    });

    const taskShape = this.append(boundaryEvent, {
      type: 'bpmn:Task',
    });

    selection.select(taskShape);
  }

  isTimeoutConfigured(element) {
    const attachers = element.attachers || [];

    return attachers.some((e) => hasDefinition(e, 'bpmn:TimerEventDefinition'));
  }

  append(element, attrs) {
    const autoPlace = this.state.modeler.get('autoPlace');
    const elementFactory = this.state.modeler.get('elementFactory');

    const shape = elementFactory.createShape(attrs);

    return autoPlace.append(element, shape);
  }

  render() {
    const { element } = this.state;

    return (
      <>
        <div className='element-properties' key={element.id}>
          <fieldset Heading>
            {is(element, 'bpmn:Task') && (
              <Text
                class='label-on-dark-background'
                style={{ fontSize: '24pt' }}
              >
                Activity
              </Text>
            )}
            {is(element, 'bpmn:Event') && (
              <Text
                class='label-on-dark-background'
                style={{ fontSize: '24pt' }}
              >
                Event
              </Text>
            )}
            {is(element, 'bpmn:Gateway') && (
              <Text
                class='label-on-dark-background'
                style={{ fontSize: '24pt' }}
              >
                Gateway
              </Text>
            )}
          </fieldset>

          <fieldset ID>
            <Text class='label-on-dark-background'>ID: </Text>
            <Text class='label-on-dark-background'>{element.id}</Text>
          </fieldset>

          <fieldset NameInput>
            <Text class='label-on-dark-background'>Name:</Text>
            <Input
              placeholder='name'
              style={{ marginBottom: '10px' }}
              /* prefix={<UserOutlined className="site-form-item-icon" />} */
              suffix={
                <Tooltip title='the name of your task, gateway or event'>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
              value={element.businessObject.name || ''}
              onChange={(event) => {
                this.updateName(event.target.value);
              }}
            />
          </fieldset>

          <fieldset RPA-Actions>
            {is(element, 'bpmn:Task') && (
              <>
                <Text class='label-on-dark-background'>Actions: </Text>
                <br />
                <Button
                  type='primary'
                  onClick={this.makeServiceTask}
                  icon={<RobotOutlined />}
                  style={{
                    width: '80%',
                    marginTop: '10px',
                    marginLeft: '30px',
                    marginRight: '30px',
                  }}
                >
                  Make RPA Task
                </Button>
                <PropertiesPanelApplicationDropdown
                  onApplicationSelection={this.updateSelectedApplication}
                  applications={sessionStorage
                    .getItem('AvailableApplications')
                    .split(',')}
                  currentSelection={
                    element.businessObject.$attrs['arkRPA:application']
                  }
                />
                <br />
                <PropertiesPanelTaskDropdown
                  listOfTasks={this.state.tasksForSelectedApplication}
                  onTaskSelection={this.updateSelectedTask}
                  disabled={this.state.disableTaskSelection}
                  currentSelection={
                    element.businessObject.$attrs['arkRPA:task']
                  }
                />
              </>
            )}
          </fieldset>
        </div>
      </>
    );
  }
}

// helpers ~ legacy ///////////////////
function hasDefinition(event, definitionType) {
  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some((d) => is(d, definitionType));
}
