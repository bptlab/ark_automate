/* eslint-disable no-alert */
import React, { useState } from 'react';
import { Col, Row, Typography, Popconfirm, Tooltip } from 'antd';
import {
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './RobotContainer.module.css';
import { initSsotSessionStorage } from '../../../utils/attributeAndParamUtils';
import { changeSsotName, deleteRobotFromDB } from '../../../api/ssotRetrieval';

const { Title } = Typography;

/**
 * @component
 * @description Provides a prototype-box for all robots to be displayed in the Robot Overview
 * @category Client
 */
const RobotContainer = (props) => {
  const { robotId, robotName, userId, refreshOverview } = props;
  const [name, setRobotName] = useState(robotName);
  const [popConfirmVisible, setPopConfirmVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [hoveredUpon, setHoveredUpon] = useState(false);

  /**
   * @description Sends a job to the server to execute a specfic robot for a specific user
   */
  const initLocalSsot = () => {
    initSsotSessionStorage(robotId);
  };

  /**
   * @description Updates the name of the robot in the backend and in the robot container
   * @param {String} newRobotName New name of the robot
   */
  const renameRobot = (newRobotName) => {
    changeSsotName(robotId, newRobotName)
      .then(() => {
        setRobotName(newRobotName);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Deletes the robot
   */
  const deleteRobot = () => {
    setConfirmLoading(true);
    deleteRobotFromDB(robotId).then(() => {
      setTimeout(() => {
        setPopConfirmVisible(false);
        setConfirmLoading(false);
        refreshOverview(robotId);
      }, 1000);
    });
  };

  return (
    <Col
      xs={24}
      sm={12}
      md={8}
      xl={6}
      xxl={4}
      onMouseEnter={() => setHoveredUpon(true)}
      onMouseLeave={() => setHoveredUpon(false)}
    >
      {hoveredUpon && (
        <Col className={[styles.box, styles.robotBox, styles.selectedRobotBox]}>
          <Row align='middle' style={{ height: '55%' }}>
            <Col type='flex' span={8}>
              <Link
                to={{
                  pathname: `/interaction_cockpit/${robotId}`,
                  state: { userId },
                }}
              >
                <Tooltip title='Execute Robot'>
                  <PlayCircleOutlined
                    onClick={initLocalSsot}
                    className={styles.clickableIcon}
                  />
                </Tooltip>
              </Link>
            </Col>
            <Col type='flex' span={8}>
              <Link to={`/modeler/${robotId}`}>
                <Tooltip title='Edit Robot'>
                  <EditOutlined className={styles.clickableIcon} />
                </Tooltip>
              </Link>
            </Col>
            <Col type='flex' span={8}>
              <Popconfirm
                title='Delete Robot?'
                visible={popConfirmVisible}
                onConfirm={deleteRobot}
                okButtonProps={{ loading: confirmLoading }}
                onCancel={() => setPopConfirmVisible(false)}
                okText='Delete'
                icon={<WarningOutlined />}
                placement='left'
              >
                <Tooltip title='Delete Robot'>
                  <DeleteOutlined
                    onClick={() => setPopConfirmVisible(true)}
                    className={styles.clickableIcon}
                  />
                </Tooltip>
              </Popconfirm>
            </Col>
          </Row>

          <Row justify='space-around' align='middle' style={{ height: '45%' }}>
            <Title
              className={styles.title}
              level={3}
              editable={{
                onChange: renameRobot,
                tooltip: false,
                icon: (
                  <Tooltip title='Edit Robot Name' placement='bottom'>
                    <EditOutlined />
                  </Tooltip>
                ),
              }}
            >
              {name}
            </Title>
          </Row>
        </Col>
      )}
      {!hoveredUpon && (
        <Col className={[styles.box, styles.robotBox]}>
          <Row
            justify='center'
            align='middle'
            style={{ height: '100%', margin: '0.5rem' }}
          >
            <Title className={styles.title} level={2}>
              {name}
            </Title>
          </Row>
        </Col>
      )}
    </Col>
  );
};

RobotContainer.propTypes = {
  robotName: PropTypes.string.isRequired,
  robotId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  refreshOverview: PropTypes.func.isRequired,
};

export default RobotContainer;
