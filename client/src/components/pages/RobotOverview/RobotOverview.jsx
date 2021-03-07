import React, { useState, useEffect } from 'react';
import { Layout, Input, Space, Row, InputNumber } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import RobotContainer from '../../content/RobotContainer/RobotContainer';
import CreateRobotContainer from '../../content/RobotContainer/CreateRobotContainer';
import {
  getCurrentUserId,
  setCurrentUserId,
} from '../../../api/userConfiguration';

const { Search } = Input;

/**
 * @description Overview page, where all robots are displayed and can be opened.
 * @category Client
 * @component
 */
const RobotOverview = () => {
  const [searchValue, setSearchValue] = useState('');
  const [userId, setUserId] = useState(1);

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    getCurrentUserId().then((data) => {
      setUserId(data.UserId);
    });
  }, []);

  /**
   * @description Updates the current user id on the server side and set the state variable userId to the new value
   */
  const changeUserId = (value) => {
    setCurrentUserId(value).then((data) => {
      setUserId(data.UserId);
    });
  };

  const updateSearchValue = (val) => {
    setSearchValue(val);
  };

  const createRobotBoxes = (searchValue2) => {
    // mock object (JSON of example-robots)
    const robotList = [
      {
        robotMetadata: { robotId: '#1234', robotName: 'EXCEL Workflow' },
      },
      {
        robotMetadata: { robotId: '#1234', robotName: 'alle E-Mails löschen' },
      },
      {
        robotMetadata: { robotId: '#1234', robotName: 'Daily CheckIn' },
      },
      {
        robotMetadata: { robotId: '#1234', robotName: 'Daily Checkout' },
      },
      {
        robotMetadata: { robotId: '#1234', robotName: 'Twitter checken' },
      },
      {
        robotMetadata: { robotId: '#1234', robotName: 'Login to PayPal' },
      },
    ];

    const filteredBotList = Object.values(robotList).filter((val) =>
      val.robotMetadata.robotName
        .toUpperCase()
        .includes(searchValue2.toUpperCase())
    );

    return (
      <>
        {filteredBotList.map((val) => (
          <RobotContainer robotName={val.robotMetadata.robotName} />
        ))}
      </>
    );
  };

  return (
    <Layout>
      <HeaderNavbar selectedKey={1} />

      <Space style={{ padding: '1rem' }} direction='vertical' size='middle'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Search
            style={{
              marginRight: '16px',
            }}
            placeholder='Search your Robot!'
            onSearch={updateSearchValue}
            enterButton
          />
          <InputNumber
            min={1}
            defaultValue={1}
            value={userId}
            onChange={changeUserId}
          />
        </div>

        <Row gutter={[16, 16]}>
          <CreateRobotContainer />
          {createRobotBoxes(searchValue)}
        </Row>
      </Space>
    </Layout>
  );
};
export default RobotOverview;
