import React, { useEffect, useState } from 'react';
import CamundaBpmnModeler from 'bpmn-js/lib/Modeler';
import { Layout } from 'antd';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import PropTypes from 'prop-types'
import CliModule from 'bpmn-js-cli';
import { emptyBpmn } from '../../../resources/modeler/empty.bpmn';
// eslint-disable-next-line camelcase
import arkRPA_ModdleDescriptor from '../../../resources/modeler/modelerPropertiesExtensionRPA/ark-rpa.json';
import styles from './BpmnModeler.module.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { parseBpmnToSsot } from '../../../utils/BpmnToSsotParsing/BpmnToSsotParsing';

const { Content } = Layout;

/**
 * @description This component renders the modeling interface as well as the sidebar.
 * @category Client
 * @component
 */
const BpmnModeler = (props) => {
  const [modeler, setModeler] = useState(null);
  let newModeler;

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    newModeler = new CamundaBpmnModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window,
      },
      additionalModules: [
        propertiesProviderModule,
        CliModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
        arkRPA: arkRPA_ModdleDescriptor,
      },
      cli: {
        bindTo: 'cli'
      }
    });
    props.onModelerUpdate(newModeler)

    const openBpmnDiagram = (xml) => {
      newModeler.importXML(xml, (error) => {
        if (error) {
          return console.error('fail import xml');
        }
        const canvas = newModeler.get('canvas');
        canvas.zoom('fit-viewport');
      });
    };

    openBpmnDiagram(emptyBpmn);
  }, []);


  // trigger rerendering of Ssot on every update
  useEffect(() => {
    newModeler.on('element.changed', () => {
      newModeler
        .saveXML({ format: true })
        .then((xml) => {
          parseBpmnToSsot(xml, props.robotId)
        })
        .catch((err) => {
          console.error(err);
        });
    });

    newModeler.on('selection.changed', () => {
    });
  }, [newModeler]);

  return (
    <Content className={styles.bpmncontainer}>
      <div className={styles['bpmn-modeler-container']} id='bpmnview' />
    </Content>
  );
};

BpmnModeler.propTypes = {
  onModelerUpdate: PropTypes.func.isRequired,
  robotId: PropTypes.string.isRequired,
};

export default BpmnModeler;
