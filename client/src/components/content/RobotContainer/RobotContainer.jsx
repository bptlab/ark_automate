/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Col, Row, Typography, Tooltip, Button, Icon } from 'antd';
import { PlayCircleOutlined, EditOutlined } from '@ant-design/icons';
import corporateDesign from '../../../layout/corporateDesign';
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
    <Col className={styles.robotWrapper} style={{}} xs={24} sm={12} md={8} xl={6}>
        <Col gutter={20} className={styles.innerBox} style={{ height: '15rem', padding: '1rem' }}>
            <Row justify="space-around" align="middle" className={styles.innerBox2} style={{ height: '50%' }}>
                <Col type="flex" span={12} className={styles.dummy}>
                    <PlayCircleOutlined onClick={startRobot} style={{ fontSize: '4rem', color: corporateDesign.colorBackgroundCta }} />
                </Col>

                <Col type="flex" span={12} style={{ alignItems: 'center' }} justify='center'>
                    <EditOutlined onClick={editRobot} style={{ fontSize: '4rem', color: corporateDesign.colorBackgroundCta }} />
                </Col>
            </Row>
            <Row style={{ height: '50%' }}>
                <Title sytle={{ color: '#123456'/* corporateDesign.colorPrimaryInvertedText */ }} className={styles.title} level={2} editable >
                    {props.robotName}
                </Title>
            </Row>
        </Col>
    </Col >
);
export default RobotContainer;
