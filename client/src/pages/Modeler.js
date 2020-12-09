import React from 'react';
import BpmnModelerComponent from '../components/BpmnModeler';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import HeaderNavbar from '../components/headerNavbar/HeaderNavbar';
import PropertiesView from '../components/properties-panel/propertiesView/PropertiesView';

import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const { Footer, Sider, Content } = Layout;


const Modeler = () => {
    return (
        <div>
            <Layout>
                <HeaderNavbar />
                <Layout>
                    <BpmnModelerComponent />
                    {/* <Content>
                        <BpmnModelerComponent />
                    </Content>
                    <Sider>
                        <Button type="primary" icon={<RobotOutlined />}>Make RPA Task</Button>
                    </Sider> */}
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
