import React, { useState, useEffect } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { emptyBpmn } from '../../../resources/modeler/empty.bpmn';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import arkRPA_ModdleDescriptor from '../../../resources/modeler/modelerPropertiesExtensionRPA/ark-rpa';
import parseDiagramJson from '../../../utils/parser.js';
import convert from 'xml-js';
import downloadString from '../../../utils/downloadString.js';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import ModelerSidebar from '../ModelerSidebar/ModelerSidebar';
import styles from './BpmnRobotModeler.module.css';

import { Layout } from 'antd';

const { Content } = Layout;

/**
 * @component
 * @description This component renders the modeling interface as well as the sidebar.
 */
const BpmnRobotModeler = () => {
  const [modeler, setModeler] = useState(null);

  useEffect(() => {
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

    setModeler(modeler);

    const openBpmnDiagram = (xml) => {
      modeler.importXML(xml, (error) => {
        if (error) {
          return console.log('fail import xml');
        }
        let canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport');
      });
    };

    openBpmnDiagram(emptyBpmn);
  }, []);

  /**
   * @description Will get the underlying xml of the current bpmn diagram, parse it into a .robot file and download it
   * @returns {undefined} The return is not defined
   */
  const getBpmnDiagramRobot = () => {
    modeler
      .saveXML()
      .then((json) => {
        const xml = json.xml;
        downloadRobotFile(xml);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Will parse a given xml file into a .robot file and download it
   * @param {string} xml String that sets the xml to be parsed
   * @returns {undefined} The return is not defined
   */
  const downloadRobotFile = (xml) => {
    const body = convert.xml2json(xml, { compact: true, spaces: 4 });
    let jsonBody = JSON.parse(body);
    let robot = parseDiagramJson(jsonBody);
    downloadString(robot, 'text/robot', 'testRobot.robot');
  };

  return (
    <Layout>
      <Content>
        <div id='bpmncontainer'>
          <div className={styles['bpmn-modeler-container']} id='bpmnview'></div>
        </div>
      </Content>
      <ModelerSidebar
        modeler={modeler}
        getBpmnDiagramRobot={getBpmnDiagramRobot}
      ></ModelerSidebar>
    </Layout>
  );
};

export default BpmnRobotModeler;
