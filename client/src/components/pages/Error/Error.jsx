import React from 'react';
import { Layout, Typography } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';

const { Title } = Typography;

/**
 * @description Error page of the application
 * @category Client
 * @component
 */
const Error = () => (
  <div>
    <Layout>
      <HeaderNavbar selectedKey={0} />
      <br />
      <Title style={{ paddingLeft: '30px' }}>Error: Page does not exist!</Title>
    </Layout>
  </div>
);

export default Error;
