import React, { useState } from 'react';
import { Layout } from 'antd';
import BpmnModeler from '../../content/BpmnModeler/BpmnModeler';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import ModelerSidebar from '../../content/ModelerSidebar/ModelerSidebar';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';

/**
 * @description Modeler page that enables the user to build a robot
 * @category Client
 * @component
 */
const Modeler = () => {
  const [modeler, setModeler] = useState(null);

  const updateModeler = (updatedModeler) => {
    setModeler(updatedModeler);
  }

  return (
    <>
      <HeaderNavbar selectedKey={2} />
      <Layout>
        <BpmnModeler onModelerUpdate={updateModeler} />
        <ModelerSidebar modeler={modeler} />
      </Layout>
    </>
  )
}

export default Modeler;
