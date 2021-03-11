import React, { useState, useEffect } from 'react';
import CamundaBpmnModeler from 'bpmn-js/lib/Modeler';
import { Layout } from 'antd';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import convert from 'xml-js';
import { emptyBpmn } from '../../../resources/modeler/empty.bpmn';
// eslint-disable-next-line camelcase
import arkRPA_ModdleDescriptor from '../../../resources/modeler/modelerPropertiesExtensionRPA/ark-rpa.json';
import { parseDiagramJson } from '../../../utils/parser/parser';
import downloadString from '../../../utils/downloadString';
import ModelerSidebar from '../ModelerSidebar/ModelerSidebar';
import styles from './BpmnModeler.module.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import getParsedRobotFile from '../../../api/ssot';

const { Content } = Layout;

/**
 * @description This component renders the modeling interface as well as the sidebar.
 * @category Client
 * @component
 */
const BpmnModeler = () => {
  const [modeler, setModeler] = useState(null);

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    const newModeler = new CamundaBpmnModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window,
      },
      additionalModules: [propertiesProviderModule],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
        arkRPA: arkRPA_ModdleDescriptor,
      },
    });
    setModeler(newModeler);

    const openBpmnDiagram = (xml) => {
      newModeler.importXML(xml, (error) => {
        if (error) {
          // eslint-disable-next-line no-console
          return console.log('fail import xml');
        }
        const canvas = newModeler.get('canvas');
        canvas.zoom('fit-viewport');
      });
    };

    openBpmnDiagram(emptyBpmn);
  }, []);

  /**
   * @description Will parse a given xml file into a .robot file and download it
   * @param {string} xml String that sets the xml to be parsed
   */
  const downloadRobotFile = () => {
    getParsedRobotFile()
      .then((response) => response.text())
      .then((robotCode) => {
        downloadString(robotCode, 'text/robot', 'testRobot.robot');
      });
  };

  return (
    <Layout>
      <Content>
        <div id='bpmncontainer'>
          <div className={styles['bpmn-modeler-container']} id='bpmnview' />
        </div>
      </Content>
      <ModelerSidebar modeler={modeler} getRobotFile={downloadRobotFile} />
    </Layout>
  );
};

export default BpmnModeler;
