import React from 'react';
import { Layout, Input, Space, Row, Col } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import RobotContainer from '../../content/RobotContainer/RobotContainer'
import CreateRobotContainer from '../../content/RobotContainer/CreateRobotContainer'
import styles from './RobotOverview.module.css';

const { Search } = Input;

// just a dummy method for further implementation
const handleSearch = value => {
  // console.log(value)
};

const createRobotBoxes = () => {
  const robotList = [{
    "robotMetadata": { "robotId": "#1234", "robotName": "EXCEL Workflow" }
  },
  {
    "robotMetadata": { "robotId": "#1234", "robotName": "alle E-Mails löschen" }
  },
  {
    "robotMetadata": { "robotId": "#1234", "robotName": "Daily CheckIn" }
  },
  {
    "robotMetadata": { "robotId": "#1234", "robotName": "Daily Checkout" }
  },
  {
    "robotMetadata": { "robotId": "#1234", "robotName": "Twitter checken" }
  },
  {
    "robotMetadata": { "robotId": "#1234", "robotName": "Login to PayPal" }
  },
  ];

  return <>
    {Object.values(robotList).map((val) => (
      <RobotContainer robotName={val.robotMetadata.robotName} />
    ))}
  </>
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

      <Space className={styles.contentWrapper} direction='vertical' size='middle' >
        <Search placeholder='Search your Robot!' onSearch={handleSearch} enterButton />

        <Row gutter={[16, 16]} >
          <CreateRobotContainer />
          {createRobotBoxes()}
        </Row>
      </Space>
    </Layout>
  </div >
);

export default RobotOverview;
