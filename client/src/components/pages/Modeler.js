import React from 'react';
import BpmnModelerComponent from '../content/BpmnModeler/BpmnModeler';
import { Layout } from 'antd';
import HeaderNavbar from '../content/HeaderNavbar/HeaderNavbar';

const { Footer } = Layout;

const Modeler = () => {
  return (
    <div>
      <Layout>
        <HeaderNavbar selectedKey={2} />
        <BpmnModelerComponent />
        <Footer>Fußzeile</Footer>
      </Layout>
    </div>
  );
};

export default Modeler;
