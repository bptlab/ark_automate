/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Col, Row, Typography } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './RobotContainer.module.css';

const { Title } = Typography;

const addRobot = () => alert("Adding Robots is currently not supported!");

/**
 * @component
 * @description #todo
 * @example return #todo
 */
const CreateRobotContainer = (props) => (
    <Col xs={24} sm={12} md={8} xl={6}>
        <Col className={styles.innerBoxCreateRobot} style={{ height: '15rem', padding: '1rem' }}>
            <Row align="middle" style={{ height: '55%' }}>
                <Col type="flex" span={24}>
                    <PlusCircleOutlined onClick={addRobot} className={styles.clickiconCreateRobot} style={{ fontSize: '4rem' }} />
                </Col>
            </Row>

            <Row justify="space-around" align="middle" style={{ height: '45%' }}>
                <Title className={styles.title} level={2} >
                    Create new Robot
                </Title>
            </Row>
        </Col>
    </Col >
);
export default CreateRobotContainer;
