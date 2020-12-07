import React, { Component } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { emptyBpmn } from "../assets/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import PropertiesView from '../components/properties-panel/propertiesView/PropertiesView';

class BpmnModelerComponent extends Component {
  modeler = null;

  componentDidMount = () => {
    const modeler = new BpmnModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window,
      },
      propertiesPanel: {
        parent: "#propview",
      },
      additionalModules: [propertiesProviderModule],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
    });
    this.modeler = modeler

    this.newBpmnDiagram();
    this.forceUpdate()
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

  render = () => {
    return (
      <div id="bpmncontainer">
        <div
          id="bpmnview"
          style={{ width: "85%", height: "98vh", float: "left" }}
        ></div>
        {this.modeler && <PropertiesView modeler={this.modeler} />}
      </div>
    );
  };
}

export default BpmnModelerComponent;
