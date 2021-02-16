/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Col, Row, Typography } from 'antd';
import { PlayCircleOutlined, EditOutlined } from '@ant-design/icons';
import styles from './RobotContainer.module.css';

const { Title } = Typography;

const startRobot = () => alert("Running the Robot is currently not supported!");
const editRobot = () => alert("Editing the Robot is currently not supported!");


/**
 * @component
 * @description #todo
 * @example return #todo
 */
const RobotContainer = (props) => (
    <Col xs={24} sm={12} md={8} xl={6}>
        <Col className={styles.innerBox} style={{ height: '15rem', padding: '1rem' }}>
            <Row align="middle" style={{ height: '55%' }}>
                <Col type="flex" span={12}>
                    <PlayCircleOutlined onClick={startRobot} className={styles.clickicon} style={{ fontSize: '4rem' }} />
                </Col>
                <Col type="flex" span={12}>
                    <EditOutlined onClick={editRobot} className={styles.clickicon} style={{ fontSize: '4rem' }} />
                </Col>
            </Row>

            <Row justify="space-around" align="middle" style={{ height: '45%' }}>
                <Title className={styles.title} level={2} editable >
                    {props.robotName}
                </Title>
            </Row>
        </Col>
    </Col >
);
export default RobotContainer;
