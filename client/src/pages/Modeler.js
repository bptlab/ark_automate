import React from 'react';
import BtnGotoHome from '../components/BtnGotoHome';
import { Typography } from 'antd';
import BpmnModelerComponent from '../components/bpmn.modeler.component';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

const { Title } = Typography;

const Modeler = () => {
  return (
    <div>
      {/*<Title>Seite unseres Modelers</Title>*/}
      <BtnGotoHome/>
      <React.StrictMode>
        <BpmnModelerComponent />
      </React.StrictMode>

    </div>
  );
};

export default Modeler;
