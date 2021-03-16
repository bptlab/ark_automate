/* eslint-disable no-alert */
import React, { useState } from 'react';
import { Col, Row, Typography } from 'antd';
import { PlayCircleOutlined, EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import styles from './RobotContainer.module.css';
import { changeSsotName } from '../../../api/ssotRetrieval';

const { Title } = Typography;

/**
 * @component
 * @description Provides a prototype-box for all robots to be displayed in the Robot Overview 
 * @category Client
 */
const RobotContainer = (props) => {

    const { robotId, robotName } = props;
    const [name, setRobotName] = useState(robotName);
    const startRobot = () => alert("Running the Robot is currently not supported!");

    const renameRobot = (value) => {
        changeSsotName(robotId, value)
            .then(() => {
                setRobotName(value);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <Col xs={24} sm={12} md={8} xl={6} xxl={4}>
            <Col className={[styles.box, styles.robotBox]}>
                <Row align="middle" style={{ height: '55%' }}>
                    <Col type="flex" span={12}>
                        <PlayCircleOutlined onClick={startRobot} className={styles.clickableIcon} />
                    </Col>
                    <Col type="flex" span={12}>
                        <Link to={`/modeler/${robotId}`}>
                            <EditOutlined className={styles.clickableIcon} />
                        </Link>
                    </Col>
                </Row>

                <Row justify="space-around" align="middle" style={{ height: '45%' }}>
                    <Title className={styles.title} level={3} editable={{ onChange: renameRobot }} >
                        {name}
                    </Title>
                </Row>
            </Col>
        </Col >
    )
};

RobotContainer.propTypes = {
    robotName: PropTypes.string.isRequired,
    robotId: PropTypes.string.isRequired,
};

export default RobotContainer;
