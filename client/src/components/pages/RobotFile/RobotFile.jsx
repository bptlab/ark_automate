import React from 'react';
import { Layout } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import { Typography } from 'antd';
import styles from './RobotFile.module.css';

const { Title } = Typography;

/**
 * @description View of the robot file
 * @category Client
 * @component
 */
const RobotFile = () => (
  <Layout>
    <HeaderNavbar selectedKey={3} />
    <Title className={styles.title}>
      In future versions, the Robot Framework code can also be edited directly
      here.
    </Title>
  </Layout>
);

export default RobotFile;
