import React from 'react';
import { Layout, Typography } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';

const { Title } = Typography;

/**
 * @description View of the robot file
 * @category Client
 * @component
 */
const RobotFile = () => (
  <Layout>
    <HeaderNavbar selectedKey={3} />
    <Title style={{ paddingLeft: '30px' }}>
      In future versions, the Robot Framework code can also be edited directly
      here.
    </Title>
  </Layout>
);

export default RobotFile;
