import React, { useEffect } from 'react';
import CamundaBpmnModeler from 'bpmn-js/lib/Modeler';
import { Layout } from 'antd';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import PropTypes from 'prop-types';
import CliModule from 'bpmn-js-cli';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import { emptyBpmn } from '../../../resources/modeler/empty.bpmn';
import styles from './BpmnModeler.module.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';

const { Content } = Layout;

/**
 * @description This component renders the modeling interface as well as the sidebar.
 * @category Client
 * @component
 */
const BpmnModeler = (props) => {
  let newModeler;

  const { getPaletteEntries } = PaletteProvider.prototype;
  // eslint-disable-next-line func-names
  PaletteProvider.prototype.getPaletteEntries = function () {
    const entries = getPaletteEntries.apply(this);
    delete entries['create.intermediate-event'];
    delete entries['create.subprocess-expanded'];
    delete entries['create.participant-expanded'];
    delete entries['create.group'];
    delete entries['create.exclusive-gateway'];
    delete entries['create.data-store'];
    delete entries['create.data-object'];
    return entries;
  };
  class CustomContextPadProvider {
    constructor(contextPad) {
      contextPad.registerProvider(this);
    }

    // eslint-disable-next-line class-methods-use-this
    getContextPadEntries() {
      // eslint-disable-next-line func-names
      return function (entries) {
        const customizesEntries = entries;
        delete customizesEntries['append.text-annotation'];
        delete customizesEntries['append.gateway'];
        delete customizesEntries['append.intermediate-event'];
        delete customizesEntries['lane-insert-above'];
        delete customizesEntries['lane-divide-two'];
        delete customizesEntries['lane-divide-three'];
        delete customizesEntries['lane-insert-below'];
        delete customizesEntries.replace;
        return customizesEntries;
      };
    }
  }

  CustomContextPadProvider.$inject = ['contextPad'];

  /**
   * @description while the components were mounted, the BPMN-Modeler get's initialized
   */
  useEffect(() => {
    newModeler = new CamundaBpmnModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window,
      },
      additionalModules: [propertiesProviderModule, CliModule],
      cli: {
        bindTo: 'cli',
      },
    });

    props.onModelerUpdate(newModeler);

    const openBpmnDiagram = (xml) => {
      newModeler.importXML(xml, (error) => {
        if (error) {
          console.error('fail import xml');
        }
        const canvas = newModeler.get('canvas');
        canvas.zoom('fit-viewport');
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
