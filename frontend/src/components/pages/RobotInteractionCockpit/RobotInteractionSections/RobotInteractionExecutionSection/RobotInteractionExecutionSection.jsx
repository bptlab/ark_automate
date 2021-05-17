import React from 'react';
import { Col, Row, Typography, Card } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  Loading3QuartersOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import RobotLogEntryCard from './subComponents/RobotLogEntryCard';
import styles from '../../RobotInteractionCockpit.module.css';

const { Title } = Typography;
/**
 * @description Renders the robot logs and robot status while execution
 * @category Frontend
 * @component
 */
const RobotInteractionExecutionSection = (props) => {
  const { executionLogs } = props;
  const { robotState } = props;

  const displayStatusIcon = (status) => {
    if (status === 'PASS' || status === 'successful') {
      return (
        <CheckCircleOutlined
          className={styles.statusIconStyle}
          style={{ color: 'green' }}
        />
      );
    }
    if (status === 'FAIL' || status === 'failed') {
      return (
        <CloseCircleOutlined
          className={styles.statusIconStyle}
          style={{ color: 'red' }}
        />
      );
    }
    if (status === 'running') {
      return (
        <Loading3QuartersOutlined
          spin
          className={styles.loadingStatusIconStyle}
        />
      );
    }
    if (status === 'waiting') {
      return (
        <PauseCircleOutlined
          className={styles.statusIconStyle}
          style={{ color: 'grey' }}
        />
      );
    }
    return undefined;
  };

  return (
    <>
      <Row>
        <Col xs={24} lg={24} xl={12}>
          <Title
            style={{
              marginBottom: '0px',
              marginLeft: '10px',
            }}
            level={5}
          >
            Robot Status
          </Title>
          <Card style={{ margin: '10px' }} hoverable>
            <Row>
              <Col span={18}>
                <Title
                  style={{
                    top: '35%',
                    position: 'absolute',
                  }}
                  level={5}
                >
                  {robotState.toLocaleUpperCase()}
                </Title>
              </Col>
              <Col span={6}>{displayStatusIcon(robotState)}</Col>
            </Row>
          </Card>
        </Col>
        <Col lg={24} xl={12}>
          <Title style={{ marginBottom: '0px', marginLeft: '10px' }} level={5}>
            Robot Run Logs
          </Title>
          {executionLogs.robot_run &&
            executionLogs.robot_run.activities.map((log) => (
              <RobotLogEntryCard
                log={log}
                displayStatusIcon={displayStatusIcon}
              />
            ))}
        </Col>
      </Row>
    </>
  );
};

RobotInteractionExecutionSection.propTypes = {
  executionLogs: PropTypes.objectOf(PropTypes.shape).isRequired,
  robotState: PropTypes.string.isRequired,
};

export default RobotInteractionExecutionSection;
