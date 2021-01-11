import React from 'react';
import BpmnModelerComponent from '../containers/bpmnModeler/BpmnModeler';
import { Layout } from 'antd';
import HeaderNavbar from '../containers/headerNavbar/HeaderNavbar';

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
