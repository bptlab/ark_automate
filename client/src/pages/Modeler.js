import React from 'react';
import BpmnModelerComponent from '../components/BpmnModeler';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import HeaderNavbar from '../components/headerNavbar/HeaderNavbar';


const { Footer, Sider, Content } = Layout;


const Modeler = () => {
    return (
        <div>
            <Layout>
                <HeaderNavbar />
                <Layout>
                    <Content>
                        <BpmnModelerComponent />
                    </Content>
                    <Sider>Sider</Sider>
                </Layout>
                <Footer>
                    Fußzeile
                </Footer>
            </Layout>


            <React.StrictMode>
            </React.StrictMode>
        </div>
    );
};

export default Modeler;
