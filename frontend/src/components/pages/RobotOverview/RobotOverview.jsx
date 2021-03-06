/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Layout, Input, Space, Row, Select } from 'antd';
import HeaderNavbar from '../../multiPageComponents/HeaderNavbar/HeaderNavbar';
import RobotContainer from './RobotContainer/RobotContainer';
import { joinRoomForUser } from '../../../api/socketHandler/socketEmitter';
import {
  successRoomConnection,
  errorRoomConnection,
  newClientJoined,
} from '../../../api/socketHandler/socketListeners';
import CreateRobotContainer from './RobotContainer/CreateRobotContainer';
import {
  initSessionStorage,
  initAvailableApplicationsSessionStorage,
} from '../../../utils/sessionStorage/sessionStorageUtils';
import {
  fetchSsotsForUser,
  createNewRobot,
} from '../../../api/routes/users/users';
import { getAllRpaFunctionalities } from '../../../api/routes/functionalities/functionalities';

const { Search } = Input;
const { Option } = Select;

/**
 * @description Overview page, where all robots are displayed and can be opened.
 * @category Frontend
 * @component
 */
const RobotOverview = () => {
  const [searchValue, setSearchValue] = useState('');
  const [userId, setUserId] = useState('80625d115100a2ee8d8e695b');
  const [robotList, setRobotList] = useState([]);

  /**
   * @description Fetches Bots for the specified user and will trigger a rerender so that it will be displayed
   * @param {String} userIdToFetch userId for which the bots will be fetched
   */
  const retrieveBotList = (userIdToFetch) => {
    fetchSsotsForUser(userIdToFetch)
      .then((response) => response.json())
      .then((data) => {
        setRobotList([]);
        setRobotList([...data]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    initSessionStorage('currentUserId', '80625d115100a2ee8d8e695b');
    initSessionStorage('robotMetadata', JSON.stringify({}));
    retrieveBotList(userId);
    getAllRpaFunctionalities()
      .then((response) => response.json())
      .then((data) => {
        initSessionStorage('taskApplicationCombinations', JSON.stringify([]));
        sessionStorage.setItem(
          'taskApplicationCombinations',
          JSON.stringify(data)
        );
        initAvailableApplicationsSessionStorage();
      });
  }, []);

  /**
   * @description The socket will join a new user room whenever the userId state changes
   */
  useEffect(() => {
    joinRoomForUser(userId);
    successRoomConnection();
    errorRoomConnection();
    newClientJoined();
  }, [userId]);

  /**
   * @description Updates the current user id in the session storage and sets the state variable userId to the new value
   * @param {Integer} value Value of the number input field used for setting the user id
   */
  const changeUserId = (value) => {
    sessionStorage.setItem('currentUserId', value);
    retrieveBotList(value);
    setUserId(value);
  };

  /**
   * @description Handles the update when a new searchValue was entered
   * @param {String} value Current value of searchbar to be stored
   */
  const updateSearchValue = (value) => {
    setSearchValue(value);
  };

  /**
   * @description Creates a new robot for the current userId
   */
  const initiateRobotCreation = () => {
    const robotName = 'New Robot';
    createNewRobot(userId, robotName)
      .then((response) => response.json())
      .then((newRobot) => {
        const newRobotList = [newRobot, ...robotList];
        setRobotList([]);
        setRobotList(newRobotList);
        retrieveBotList(userId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Creates all boxes for the robots from the database
   * @param {String} currentSearchValue Currently stored value of the search bar, by which the boxes to be displayed are selected
   * @returns {React.ReactElement} All Boxes that match the current searchValue as React component
   */
  const createRobotBoxes = (currentSearchValue) => {
    const filteredRobotList = Object.values(robotList)
      .filter((robot) => robot.robotName !== undefined)
      .filter((robot) =>
        robot.robotName.toUpperCase().includes(currentSearchValue.toUpperCase())
      );

    return (
      <>
        {filteredRobotList.map((robot) => (
          <RobotContainer
            key={robot._id}
            userId={userId}
            // eslint-disable-next-line no-underscore-dangle
            robotId={robot._id}
            robotName={robot.robotName}
            refreshOverview={() => retrieveBotList(userId)}
          />
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
            placeholder='Search your Robot'
            onSearch={updateSearchValue}
            enterButton
          />
          <Select
            onChange={changeUserId}
            defaultValue='80625d115100a2ee8d8e695b'
          >
            <Option key='user1' value='80625d115100a2ee8d8e695b'>
              Lukas
            </Option>
            <Option key='user2' value='365889fcf871cfe88711b630'>
              Erik
            </Option>
            <Option key='user3' value='225aa14130f2c07789cfa38e'>
              Sandro
            </Option>
            <Option key='user4' value='afdb3d839ca02a106750a2a0'>
              Daniel
            </Option>
          </Select>
        </div>

        <Row gutter={[16, 16]}>
          <CreateRobotContainer createNewRobot={initiateRobotCreation} />
          {createRobotBoxes(searchValue)}
        </Row>
      </Space>
    </Layout>
  );
};
export default RobotOverview;
