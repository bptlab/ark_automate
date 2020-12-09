import { is } from 'bpmn-js/lib/util/ModelUtil';

import React, { Component } from 'react';
import PropertiesPanelApplicationDropdown from '../propertiesPanelApplicationDropdown/PropertiesPanelApplicationDropdown'
import PropertiesPanelTaskDropdown from '../propertiesPanelTaskDropdown/PropertiesPanelTaskDropdown'

import '../propertiesView/PropertiesView.css';

const activityDataRetrieval = require('../../../assets/xmlUtils');

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
      disableTaskSelection: true
    };

    let { element } = this.state;
    if (element.labelTarget) {
      this.setState({
        element: element.labelTarget
      });
    }

    this.updateSelectedApplication = this.updateSelectedApplication.bind(this);
    this.updateSelectedTask = this.updateSelectedTask.bind(this);
    this.makeServiceTask = this.makeServiceTask.bind(this);

    this.initSessionStorage('TaskToApplicationCache', JSON.stringify({}));
    this.initSessionStorage('AvailableApplications', []);
  }

  /**
   * @description Checks if passed item already exists in session storage and initializes with given value if not existing.
   * @param {*} itemToCheckFor - The selected item to check for in the session storage.
   * @param {*} valueToInitTo - The value to init to if the item is not existing in session storage yet.
   */
  initSessionStorage(itemToCheckFor, valueToInitTo) {
    if (sessionStorage.getItem(itemToCheckFor) === null) sessionStorage.setItem(itemToCheckFor, valueToInitTo);
  }

  /**
   * @description
   * Checks if available application list hast just been initialized 
   * or already populated with values and does so if not done yet.
   */
  componentDidMount() {
    let applicationList = sessionStorage.getItem('AvailableApplications');
    if (applicationList.length < 1) this.saveAvailableApplicationsToSessionStorage();

    this.checkForExistingRPAAttributes();
  }

  /**
   * @description gets called each time the Component is mounted to ensure that if an
   * element already has an app and Task selected, those will be displayed
   */
  checkForExistingRPAAttributes() {
    let {element} = this.state;
    if (element.businessObject['$attrs']['arkRPA:application']) this.getTasksForApplication(element.businessObject['$attrs']['arkRPA:application']);

    if (!(element.businessObject['$attrs']['arkRPA:application']) && this.state['disableTaskSelection']) {
      this.setState({disableTaskSelection: true});
    } else  {
      this.setState({disableTaskSelection: false});
    }
  }

  /**
   * @description Fetch all applications from MongoBD and save in session storage.
   */
  async saveAvailableApplicationsToSessionStorage() {
    await fetch('/get-available-applications')
      .then((response) => response.json())
      .then(data => {
        console.log(data);
        sessionStorage.setItem('AvailableApplications', data);
      })
  }

  /**
   * @description 
   * Checks if tasks for selected application are already stored in session storage.
   * Otherwise, fetch tasklist from MongoDB.
   */
  async getTasksForApplication(selectedApplication) {
    let currentSavedTasksObject = JSON.parse(sessionStorage.getItem('TaskToApplicationCache'));

    if (selectedApplication in currentSavedTasksObject) {
      this.setState({
        selectedApplication: selectedApplication,
        tasksForSelectedApplication: currentSavedTasksObject[selectedApplication],
        disableTaskSelection: false
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
    await fetch('get-available-tasks-for-application?application=' + selectedApplication.replaceAll(' ', '+'))
      .then((response) => response.json())
      .then(data => {
        currentSavedTasksObject[selectedApplication] = data;
        sessionStorage.setItem('TaskToApplicationCache', JSON.stringify(currentSavedTasksObject));

        this.setState({
          tasksForSelectedApplication: data,
          disableTaskSelection: false
        });
      })
  }

  updateName(name) {
    const modeling = this.state['modeler'].get('modeling');
    let { element } = this.state;
    modeling.updateLabel(element, name);
  }

  updateTopic(topic) {
    const modeling = this.state['modeler'].get('modeling');

    let { element } = this.state;
    modeling.updateProperties(element, {
      'custom:topic': topic,
    });
  }

  updateSelectedApplication(event) {
    this.setState({
      selectedApplication: event.target.value
    }, () => this.getTasksForApplication(event.target.value));
  }

  updateSelectedTask(event) {
    this.setState({
      selectedTask: event.target.value
    }, () => {
      const modeling = this.state['modeler'].get('modeling');
      let { element } = this.state;
      activityDataRetrieval.fetchAndUpdateRPAProperties(this.state['selectedApplication'], event.target.value, modeling, element, this.state['modeler']);
    })
  }

  makeServiceTask(name) {
    const bpmnReplace = this.state['modeler'].get('bpmnReplace');

    let { element } = this.state;
    bpmnReplace.replaceElement(element, {
      type: 'bpmn:ServiceTask',
    });
  }

  attachTimeout() {
    const modeling = this.state['modeler'].get('modeling');
    //  const autoPlace = this.state['modeler'].get('autoPlace');
    const selection = this.state['modeler'].get('selection');

    let { element } = this.state;
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
    const autoPlace = this.state['modeler'].get('autoPlace');
    const elementFactory = this.state['modeler'].get('elementFactory');

    var shape = elementFactory.createShape(attrs);

    return autoPlace.append(element, shape);
  }

  render() {
    let { element } = this.state;

    return (<>
      <div className='element-properties' key={element.id}>
        <fieldset>
          <label>id</label>
          <span>{element.id}</span>
        </fieldset>

        <fieldset>
          <label>name</label>
          <input
            value={element.businessObject.name || ''}
            onChange={(event) => {
              this.updateName(event.target.value);
            }}
          />
        </fieldset>

        {is(element, 'custom:TopicHolder') && (
          <fieldset>
            <label>topic (custom)</label>
            <input
              value={element.businessObject.get('custom:topic')}
              onChange={(event) => {
                this.updateTopic(event.target.value);
              }}
            />
          </fieldset>
        )}

        <fieldset>
          <label>actions</label>

          {is(element, 'bpmn:Task') && !is(element, 'bpmn:ServiceTask')}
          {
            is(element, 'bpmn:Task') && (
              <>
                <button onClick={this.makeServiceTask}>Make RPA Task</button>
                <PropertiesPanelApplicationDropdown
                  onApplicationSelection={this.updateSelectedApplication}
                  applications={sessionStorage.getItem('AvailableApplications').split(',')}
                  currentSelection={element.businessObject['$attrs']['arkRPA:application']} />
                <PropertiesPanelTaskDropdown
                  listOfTasks={this.state['tasksForSelectedApplication']}
                  onTaskSelection={this.updateSelectedTask}
                  disabled={this.state['disableTaskSelection']} 
                  currentSelection={element.businessObject['$attrs']['arkRPA:task']} />
              </>
            )
          }
        </fieldset>
      </div >
    </>);
  }
}

// helpers ~ legacy ///////////////////

function hasDefinition(event, definitionType) {
  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some((d) => is(d, definitionType));
}