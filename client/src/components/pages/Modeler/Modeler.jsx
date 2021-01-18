import React from 'react';
import BpmnRobotModeler from '../../content/BpmnRobotModeler/BpmnRobotModeler';
import { Layout } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';

const { Footer } = Layout;

const Modeler = () => {
  return (
    <div>
      <Layout>
        <HeaderNavbar selectedKey={2} />
        <BpmnRobotModeler />
        <Footer>Fußzeile</Footer>
      </Layout>
    </div>
  );
};

export default Modeler;
