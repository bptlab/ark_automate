/* eslint-disable no-alert */
import React, { useState } from 'react';
import { Col, Row, Typography } from 'antd';
import { PlayCircleOutlined, EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './RobotContainer.module.css';
import { changeSsotName } from '../../../api/ssotRetrieval';
import setRobotJob from '../../../api/jobs';
import isBotExecutable from '../../../utils/botExecution';

const { Title } = Typography;

/**
 * @component
 * @description Provides a prototype-box for all robots to be displayed in the Robot Overview
 * @category Client
 */
const RobotContainer = (props) => {
  const { robotId, robotName, userId } = props;
  const [name, setRobotName] = useState(robotName);

  const renameRobot = (value) => {
    changeSsotName(robotId, value)
      .then(() => {
        setRobotName(value);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Will add a new job with the current robot id to the job list on the server side
   */
  const startRobot = () => {
    if (isBotExecutable()) {
      setRobotJob(robotId, userId);
    } else {
      alert('Your Bot is not ready to be executed!');
    }
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
            <Link to={`/modeler/${robotId}`}>
              <EditOutlined className={styles.clickableIcon} />
            </Link>
          </Col>
        </Row>

        <Row justify='space-around' align='middle' style={{ height: '45%' }}>
          <Title
            className={styles.title}
            level={3}
            editable={{ onChange: renameRobot }}
          >
            {name}
          </Title>
        </Row>
      </Col>
    </Col>
  );
};

RobotContainer.propTypes = {
  robotName: PropTypes.string.isRequired,
  robotId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default RobotContainer;
