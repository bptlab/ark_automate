import React from 'react';
import { Layout, Typography, Input, Space, FlexBox, Row, Col } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import RobotContainer from '../../content/RobotContainer/RobotContainer'
import styles from './RobotOverview.module.css';

const { Search } = Input;

// just a dummy method for further implementation
const handleSearch = value => {
  // console.log(value)
};

/**
 * @description Overview page, where all robots are displayed.
 * @category Client
 * @component
 */
const RobotOverview = () => (
  <div>
    <Layout>
      <HeaderNavbar selectedKey={1} />

      <Space className={styles.contentWrapper} direction='vertical' size='large' style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          <Search placeholder='Search your Robot!' onSearch={handleSearch} enterButton />
        </Row>

        <Row gutter={[16, 16]} style={{ width: '100%' }} >
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
          <RobotContainer robotName='MyRobot' />
        </Row>
      </Space>



    </Layout>
  </div >
);

export default RobotOverview;
