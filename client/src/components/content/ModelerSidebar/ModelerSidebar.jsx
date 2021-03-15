/* eslint-disable react/prop-types */
import React from 'react';
import { Layout, Button, Space } from 'antd';
import styles from './ModelerSidebar.module.css';
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel';
import getParsedRobotFile from "../../../api/ssot";
import downloadString from '../../../utils/downloadString';

const { Sider } = Layout;

/**
 * @description This component renders the modeling sidebar.
 * @category Client
 * @component
 */
const ModelerSidebar = ({ modeler, getRobotFile }) => {
  /**
 * @description Will parse a given xml file into a .robot file and download it
 * @param {string} xml String that sets the xml to be parsed
 */
  const downloadRobotFile = () => {
    getParsedRobotFile()
      .then((response) => response.text())
      .then((robotCode) => {
        downloadString(robotCode, 'text/robot', 'testRobot.robot');
      });
  };
  return (
    <Sider className={styles.sider}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {modeler && <PropertiesPanel modeler={modeler} />}
        <Button type='primary' className={styles.button} onClick={downloadRobotFile}>
          Get Robot file
      </Button>
      </Space>
    </Sider>

  )
}

export default ModelerSidebar;
