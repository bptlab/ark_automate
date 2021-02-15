/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Col } from 'antd';
import corporateDesign from '../../../layout/corporateDesign';


const boxStyle = {
    width: '100%',
    height: '20rem',
};

/**
 * @component
 * @description #todo
 * @example return #todo
 */
const RobotContainer = (props) => (
    <Col style={boxStyle} xs={24} sm={12} md={8} xl={6}>
        <Col style={{ height: '100%', background: '#134576' }}>
            <div style={{ color: corporateDesign.colorPrimaryInvertedText }}>{props.robotName}</div>
        </Col>
    </Col >
);
export default RobotContainer;
