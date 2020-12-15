import React from 'react';
import BpmnModelerComponent from '../components/bpmnModeler/BpmnModeler';
import { Layout } from 'antd';
import HeaderNavbar from '../components/headerNavbar/HeaderNavbar';

const { Footer } = Layout;

const Modeler = () => {
    return (
        <div>
            <Layout>
                <HeaderNavbar selectedKey={2} />
                <BpmnModelerComponent />
                <Footer>
                    Fußzeile
                </Footer>
            </Layout>
        </div>
    );
};

export default Modeler;
