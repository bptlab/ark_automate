import React, { useEffect } from 'react';
import CamundaBpmnModeler from 'bpmn-js/lib/Modeler';
import { Layout } from 'antd';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import PropTypes from 'prop-types';
import CliModule from 'bpmn-js-cli';
import removeUnsupportedBpmnFunctions from './RemoveUnsupportedBpmnFunctions';
import { emptyBpmn } from '../../../../resources/modeler/empty.bpmn';
import styles from './BpmnModeler.module.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';

const { Content } = Layout;

/**
 * @description This component renders the modeling interface as well as the sidebar.
 * @category Frontend
 * @component
 */
const BpmnModeler = (props) => {
  let newModeler;

  /**
   * @description while the components were mounted, the BPMN-Modeler get's initialized
   */
  useEffect(() => {
    newModeler = new CamundaBpmnModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window,
      },
      additionalModules: [
        {
          __init__: ['customContextPadProvider'],
          customContextPadProvider: ['type', removeUnsupportedBpmnFunctions()],
        },
        propertiesProviderModule,
        CliModule,
      ],
      cli: {
        bindTo: 'cli',
      },
    });

    props.onModelerUpdate(newModeler);

    const openBpmnDiagram = (xml) => {
      newModeler
        .importXML(xml)
        .then(() => {
          const canvas = newModeler.get('canvas');
          canvas.zoom('fit-viewport');
        })
        .catch((error) => {
          console.error('failed to import xml: ', error);
        });
    };
    openBpmnDiagram(emptyBpmn);
  }, []);

  return (
    <Content className={styles.bpmncontainer}>
      <div className={styles['bpmn-modeler-container']} id='bpmnview' />
    </Content>
  );
};

BpmnModeler.propTypes = {
  onModelerUpdate: PropTypes.func.isRequired,
};

export default BpmnModeler;
