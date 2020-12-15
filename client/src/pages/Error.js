import React from 'react';
import HeaderNavbar from '../components/headerNavbar/HeaderNavbar';
import { Layout, Typography } from 'antd';

const { Title } = Typography;

const Error = () => {
    return (
        <div>
            <Layout>
                <HeaderNavbar selectedKey={0} />
                <br />
                <Title style={{ paddingLeft: '30px' }}>Error: Page does not exist!</Title>
            </Layout>
        </div>
    );
}

export default Error;
