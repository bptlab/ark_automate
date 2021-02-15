import React from 'react';
import { Layout, Typography } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';

const { Title } = Typography;

/**
 * @description Overview page, where all robots are displayed.
 * @category Client
 * @component
 */
const RobotOverview = () => (
  <div>
    <Layout>
      <HeaderNavbar selectedKey={1} />
      <br />
      <Title style={{ paddingLeft: '30px' }}>Welcome to Overview!</Title>
    </Layout>
  </div>
);

export default RobotOverview;
