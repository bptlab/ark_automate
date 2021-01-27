/* eslint-disable react/prop-types */
import React from 'react';
import { Layout, Button } from 'antd';
import styles from './ModelerSidebar.module.css';
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel';

const { Sider } = Layout;

/**
 * @description This component renders the modeling sidebar.
 * @category Client
 * @component
 */
const ModelerSidebar = ({ modeler, getRobotFile }) => (
  <Sider className={styles.sider}>
    {modeler && <PropertiesPanel modeler={modeler} />}
    <Button type='primary' className={styles.button} onClick={getRobotFile}>
      Get Robot file
    </Button>
  </Sider>
);

export default ModelerSidebar;
