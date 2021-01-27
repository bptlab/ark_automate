import React from 'react';
import BpmnModeler from '../../content/BpmnModeler/BpmnModeler';
import { Layout } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';

const { Footer } = Layout;

/**
 * @description Modeler page that enables the user to build a robot
 * @category Client
 * @component
 */
const Modeler = () => (
  <div>
    <Layout>
      <HeaderNavbar selectedKey={2} />
      <BpmnModeler />
      <Footer>Fußzeile</Footer>
    </Layout>
  </div>
);

export default Modeler;
