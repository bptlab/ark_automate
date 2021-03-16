/* eslint-disable react/prop-types */
import React from 'react';
import { Layout, Button, Space } from 'antd';
import styles from './ModelerSidebar.module.css';
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel';

const { Sider } = Layout;

/**
 * @description This component renders the modeling sidebar.
 * @category Client
 * @component
 */
const ModelerSidebar = ({ modeler, getRobotFile, robotId }) => (
  <Sider className={styles.sider}>
    <Space direction='vertical' size='large' style={{ width: '100%' }}>
      {modeler && <PropertiesPanel robotId={robotId} modeler={modeler} />}
      <Button type='primary' className={styles.button} onClick={getRobotFile}>
        Get Robot file
      </Button>
    </Space>
  </Sider>
);

export default ModelerSidebar;
