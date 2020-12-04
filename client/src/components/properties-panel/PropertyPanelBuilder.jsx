/**
 * List of TODOs (order does NOT represent urgency)
 * - there are problems which happen with the element and modeler. I tried fixing it, but couldn't manage it yet.
 *    please use with care and refactor!
 * - https://react-select.com/home could be a consideration going forward because of the additional functionality it offers of typing into the field i.e.
 * - when updating the list of tasks available there is an issue with the state as it seems to be one step behind and not have the current selected Application
 * - If possible the map functionality should be back-introduced as it could save valuable seconds when switching back and forth between apps so that
 *    the tasks do not need to be refreshed every time
 * - the previous todo could be one step to achieve this, but currently the selection of tasks is ready too slow for my taste after selecting the application
 * - research if there is any better way than binding the 'this' keyword for the callback functions for the child components
 * - use a consistent naming scheme i.e. use of the plural of property throughout names
 */
import { is } from 'bpmn-js/lib/util/ModelUtil';

import React, { Component } from 'react';
import PropertiesPanelApplicationDropdown from './PropertiesPanelApplicationDropdown'
import PropertiesPanelTaskDropdown from './PropertiesPanelTaskDropdown'

import './PropertiesView.css';

var applicationsList = [], taskList = [];
var applicationToTaskMap = new Map();

export default class PropertyPanelBuilder extends Component {
  constructor(props) {
    super(props);
    this.applicationDropdownRef = React.createRef();
    this.state = {
      selectedElements: [],
      element: props.element,
      modeler : props.modeler,
      availableApplications : [''],
      selectedApplication : '',
      tasksForSelectedApplication : [''],
      disableTaskSelection : true
    };

    let {element} = this.state;
    if (element.labelTarget) {
      this.setState({
        element : element.labelTarget
      });
    }
  }

  componentDidMount() {
    this.getAvailableApplications();
    console.log(this.state['availableApplications']);
  }

  async getAvailableApplications() {
    await fetch('/get-available-applications')
          .then((response) => response.json())
          .then(data => {
            console.log(data);
            this.setState({
              availableApplications : data
            });
        })
    console.log('Set State to App List');
  }

  updateName(name) {
    const modeling = this.state['modeler'].get('modeling');
    let {element} = this.state;
    modeling.updateLabel(element, name);
  }

  updateTopic(topic) {
    const modeling = this.state['modeler'].get('modeling');

    let {element} = this.state;
    modeling.updateProperties(element, {
      'custom:topic': topic,
    });
  }

  updateSelectedApplication(event) {
    this.getTasksForApplication(event.target.value); 

    this.setState({
      selectedApplication : event.target.value
    }, () => console.log('New state: ', this.state));
    console.log('New Application selected: ' + event.target.value);
  }

  async getTasksForApplication(application) { //this should later be done through the state, but caused problems doing so for now
    await fetch('get-available-tasks-for-application?application=' + application.replace(' ', '+'))
      .then((response) => response.json())
      .then(data => {
        console.log('list of returned tasks for app: ', data);
        this.setState({
          tasksForSelectedApplication : data,
          disableTaskSelection : false
        });
    }, () => console.log('Updated Parent State:', this.state));
  }

  updateSelectedTask(event) {
    this.setState({
      selectedTask : event.target.value
    });
    console.log('New Task selected: ' + event.target.value + ' for Application ' + this.state['selectedApplication']);
  }

  /*   function makeMessageEvent() {
      const bpmnReplace = modeler.get('bpmnReplace');
  
      bpmnReplace.replaceElement(element, {
        type: element.businessObject.$type,
        eventDefinitionType: 'bpmn:TimerEventDefinition',
      });
    } */


  makeServiceTask(name) {
    const bpmnReplace = this.state['modeler'].get('bpmnReplace');

    let {element} = this.state;
    bpmnReplace.replaceElement(element, {
      type: 'bpmn:ServiceTask',
    });
  }

  attachTimeout() {
    const modeling = this.state['modeler'].get('modeling');
    const autoPlace = this.state['modeler'].get('autoPlace');
    const selection = this.state['modeler'].get('selection');

    let {element} = this.state;
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

  //maybe interesting Stuff for JSON-Testing
  /* const applicationsJSON = {
    applications: [
      { appID: 'word', appLabel: 'Microsoft Word' },
      { appID: 'excel', appLabel: 'Microsoft EXCEL' },
    ],
  }; */

  render () {
    let {element} = this.state;

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
              <PropertiesPanelApplicationDropdown onApplicationSelection={this.updateSelectedApplication.bind(this)} applications={this.state['availableApplications']}/>
              <PropertiesPanelTaskDropdown listOfTasks={this.state['tasksForSelectedApplication']} onTaskSelection={this.updateSelectedTask.bind(this)} disabled={this.state['disableTaskSelection']}/>
            </>
          )
        }
      </fieldset>
    </div >
    </>);
  }
}

// helpers ///////////////////

function hasDefinition(event, definitionType) {
  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some((d) => is(d, definitionType));
}
