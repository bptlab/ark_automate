/* eslint-disable no-alert */
import React, { useState } from 'react';
import { Col, Row, Typography } from 'antd';
import { PlayCircleOutlined, EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './RobotContainer.module.css';
import { changeSSOTName } from '../../../api/SSOTretrieval';
import setRobotJob from '../../../api/robot';
import isBotExecutable from '../../../utils/botExecution';

const { Title } = Typography;

/**
 * @component
 * @description Provides a prototype-box for all robots to be displayed in the Robot Overview
 * @category Client
 */
const RobotContainer = (props) => {
  const { robotId } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const [robotName, setRobotName] = useState(props.robotName);

  /**
   * @description Will add a new job with the current robot id to the job list on the server side
   */
  const startRobot = () => {
    if (isBotExecutable()) {
      setRobotJob(robotId);
    } else {
      alert('Your Bot is not ready to be executed!');
    }
  };

  const editRobot = () =>
    alert('Editing the Robot is currently not supported!');

  const renameRobot = (value) => {
    changeSSOTName(robotId, value)
      .then(() => {
        setRobotName(value);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Col xs={24} sm={12} md={8} xl={6} xxl={4}>
      <Col className={[styles.box, styles.robotBox]}>
        <Row align='middle' style={{ height: '55%' }}>
          <Col type='flex' span={12}>
            <PlayCircleOutlined
              onClick={startRobot}
              className={styles.clickableIcon}
            />
          </Col>
          <Col type='flex' span={12}>
            <EditOutlined
              onClick={editRobot}
              className={styles.clickableIcon}
            />
          </Col>
        </Row>

        <Row justify='space-around' align='middle' style={{ height: '45%' }}>
          <Title
            className={styles.title}
            level={3}
            editable={{ onChange: renameRobot }}
          >
            {robotName}
          </Title>
        </Row>
      </Col>
    </Col>
  );
};
export default RobotContainer;

RobotContainer.propTypes = {
  robotName: PropTypes.string.isRequired,
  robotId: PropTypes.string.isRequired,
};
