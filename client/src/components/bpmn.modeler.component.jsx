import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { emptyBpmn } from '../assets/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import parser from '../parser.js';
import convert from 'xml-js';

class BpmnModelerComponent extends Component {
  modeler = null;
  componentDidMount = () => {
    this.modeler = new BpmnModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window,
      },
      propertiesPanel: {
        parent: '#propview',
      },
      additionalModules: [propertiesPanelModule, propertiesProviderModule],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
    });

    this.newBpmnDiagram();
  };

  newBpmnDiagram = () => {
    this.openBpmnDiagram(emptyBpmn);
  };

  openBpmnDiagram = (xml) => {
    this.modeler.importXML(xml, (error) => {
      if (error) {
        return console.log('fail import xml');
      }

      var canvas = this.modeler.get('canvas');

      canvas.zoom('fit-viewport');
    });
  };

  downloadString = (text, fileType, fileName) => {
    var blob = new Blob([text], { type: fileType });

    var element = document.createElement('a');
    element.download = fileName;
    element.href = URL.createObjectURL(blob);
    element.dataset.downloadurl = [
      fileType,
      element.download,
      element.href,
    ].join(':');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(function () {
      URL.revokeObjectURL(element.href);
    }, 1500);
  };

  getBpmnDiagramRobot = () => {
    this.modeler.saveXML().then((json) => {
      var xml = json.xml;
      this.downloadRobotFile(xml);
    });
  };

  downloadRobotFile = (xml) => {
    var body = convert.xml2json(xml, { compact: true, spaces: 4 });
    let jsonBody = JSON.parse(body);
    let robot = parser.parseDiagramJson(jsonBody);
    this.downloadString(robot, 'text/robot', 'testRobot.robot');
  };

  render = () => {
    return (
      <div id='bpmncontainer'>
        <div
          id='propview'
          style={{
            width: '25%',
            height: '98vh',
            float: 'right',
            maxHeight: '98vh',
            overflowX: 'auto',
          }}
        ></div>
        <div
          id='bpmnview'
          style={{ width: '75%', height: '98vh', float: 'left' }}
        >
          <button onClick={this.getBpmnDiagramRobot}>Get Robot file</button>
        </div>
      </div>
    );
  };
}

export default BpmnModelerComponent;
