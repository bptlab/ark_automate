import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { emptyBpmn } from '../../assets/empty.bpmn';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import PropertiesView from '../properties-panel/propertiesView/PropertiesView';
import arkRPA_ModdleDescriptor from '../../assets/modelerPropertiesExtensionRPA/ark-rpa';
import parser from '../../parser.js';
import convert from 'xml-js';

import './BpmnModeler.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';

import { Layout, Button } from 'antd';

const { Content, Sider } = Layout;

/**
 * @class
 * @component
 * @classdesc This class renders the modeling interface as well as the sidebar.
 * @example return <BpmnModelerComponent />
 */
class BpmnModelerComponent extends Component {
  modeler = null;

  componentDidMount = () => {
    const modeler = new BpmnModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window,
      },
      propertiesPanel: {
        parent: '#propview',
      },
      additionalModules: [propertiesProviderModule],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
        arkRPA: arkRPA_ModdleDescriptor,
      },
    });
    this.modeler = modeler;

    this.newBpmnDiagram();
    this.forceUpdate();
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

  /**
   * @description Will download a given string as a file
   * @param {string} text String that will be the content of the downloaded file
   * @param {string} fileType String that sets the file type of the downloaded file; Use form text/filetype
   * @param {string} fileName String that sets the name of the downloaded file; Use the same filetype as given in the fileType parameter e.g. name.filetype
   * @returns {undefined} The return is not defined
   */
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

  /**
   * @description Will get the underlying xml of the current bpmn diagram, parse it into a .robot file and download it
   * @returns {undefined} The return is not defined
   */
  getBpmnDiagramRobot = () => {
    this.modeler.saveXML().then((json) => {
      var xml = json.xml;
      this.downloadRobotFile(xml);
    });
  };

  /**
   * @description Will parse a given xml file into a .robot file and download it
   * @param {string} xml String that sets the xml to be parsed
   * @returns {undefined} The return is not defined
   */
  downloadRobotFile = (xml) => {
    var body = convert.xml2json(xml, { compact: true, spaces: 4 });
    let jsonBody = JSON.parse(body);
    let robot = parser.parseDiagramJson(jsonBody);
    this.downloadString(robot, 'text/robot', 'testRobot.robot');
  };

  render = () => {
    return (
      <Layout>
        <Content>
          <div id='bpmncontainer'>
            <div
              id='bpmnview'
              style={{ width: '85%', height: '98vh', float: 'left' }}
            ></div>
          </div>
        </Content>
        <Sider class='sider' width={350}>
          {this.modeler && <PropertiesView modeler={this.modeler} />}
          <Button
            type='primary'
            style={{
              width: '80%',
              marginTop: '10px',
              marginLeft: '30px',
              marginRight: '30px',
              marginBottom: '50px',
            }}
            onClick={this.getBpmnDiagramRobot}
          >
            Get Robot file
          </Button>
        </Sider>
      </Layout>
    );
  };
}

export default BpmnModelerComponent;
