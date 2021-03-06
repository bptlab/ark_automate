/* eslint-disable no-alert */
import React from 'react';
import { Col, Row, Typography } from 'antd';
import { PlayCircleOutlined, EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import styles from './RobotContainer.module.css';

const { Title } = Typography;

/**
 * @component
 * @description Provides a prototype-box for all robots to be displayed in the Robot Overview 
 * @category Client
 */
const RobotContainer = (props) => {

    const { robotName } = props;
    const startRobot = () => alert("Running the Robot is currently not supported!");
    const editRobot = () => alert("Editing the Robot is currently not supported!");

    const shortenTitle = (botName) => {
        const titleLength = 18;
        if (botName.length < titleLength) {
            return botName;
        }
        return `${botName.substring(0, titleLength - 2)}...`;
    }

    return (
        <Col /* id="robotContainer" */ xs={24} sm={12} md={8} xl={6}>
            <Col className={[styles.box, styles.robotBox]}>
                <Row align="middle" style={{ height: '55%' }}>
                    <Col type="flex" span={12}>
                        <PlayCircleOutlined onClick={startRobot} className={styles.clickableIcon} />
                    </Col>
                    <Col type="flex" span={12}>
                        <EditOutlined onClick={editRobot} className={styles.clickableIcon} />
                    </Col>
                </Row>

                <Row justify="space-around" align="middle" style={{ height: '45%' }}>
                    <Title className={styles.title} level={3} editable >
                        {shortenTitle(robotName)}
                    </Title>
                </Row>
            </Col>
        </Col >
    )
};
export default RobotContainer;

RobotContainer.propTypes = {
    robotName: PropTypes.string.isRequired,
};
