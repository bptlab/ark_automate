import React from 'react';
import { Layout } from 'antd';
import BpmnModelerComponent from '../content/BpmnModeler/BpmnModeler';
import HeaderNavbar from '../content/HeaderNavbar/HeaderNavbar';

const { Footer } = Layout;

const Modeler = () => (
    <div>
      <Layout>
        <HeaderNavbar selectedKey={2} />
        <BpmnModelerComponent />
        <Footer>Fußzeile</Footer>
      </Layout>
    </div>
  );

export default Modeler;
