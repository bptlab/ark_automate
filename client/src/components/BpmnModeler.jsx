import React, { Component } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { emptyBpmn } from "../assets/empty.bpmn";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import PropertiesView from './properties-panel/propertiesView/PropertiesView';

import './BpmnModeler.css'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";

import { Layout } from 'antd';

const { Content, Sider } = Layout;

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
      <Layout>
        <Content>
          <div id="bpmncontainer">
            <div
              id="bpmnview"
              style={{ width: "85%", height: "98vh", float: "left" }}
            ></div>
          </div>
        </Content>
        <Sider
          class="sider"
          width={350}>
          {this.modeler && <PropertiesView modeler={this.modeler} />}
        </Sider>
      </Layout>
    );
  };
}

export default BpmnModelerComponent;
