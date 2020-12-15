import React from 'react';
import { Layout } from 'antd';
import HeaderNavbar from '../components/headerNavbar/HeaderNavbar';
import { Typography } from 'antd';

const { Title } = Typography;

const RobotFile = () => {
    return (
        <div>
            <Layout>
                <HeaderNavbar selectedKey={3} />
                <br />
                <Title style={{ paddingLeft: '30px' }}>
                    In future versions, the Robot Framework code can also be edited directly here.
                </Title>
            </Layout>
        </div>
    );
};

export default RobotFile;
