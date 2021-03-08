import React from 'react';
import { Col, Row, Typography } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './RobotContainer.module.css';
import corporateDesign from '../../../layout/corporateDesign';

const { Title } = Typography;

/**
 * @component
 * @description Provides the first Box of Robot Overview with the "Create new Robot"-Box
 * @category Client
 */
const CreateRobotContainer = () => {

    // eslint-disable-next-line no-alert
    const addRobot = () => alert("Adding Robots is currently not supported!");

    return (
        <Col xs={24} sm={12} md={8} xl={6} xxl={4}>
            <Col className={[styles.box, styles.createRobotBox]} >
                <Row align="middle" style={{ height: '70%' }}>
                    <Col type="flex" span={24}>
                        <PlusCircleOutlined onClick={addRobot} style={{ fontSize: '6rem', color: corporateDesign.colorBackground }} />
                    </Col>
                </Row>

                <Row justify="space-around" align="middle" style={{ height: '40%' }}>
                    <Title className={styles.title} level={3} >
                        Create new Robot
                    </Title>
                </Row>
            </Col>
        </Col >
    )
};
export default CreateRobotContainer;