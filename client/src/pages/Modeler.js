import React from 'react';
import BtnGotoHome from '../components/BtnGotoHome';
import bpmn_example from '../bpmn_example.png'
import {Typography} from 'antd';

const {Title} = Typography;

const Modeler = () => {
    return (
        <div>
            <Title>Seite unseres Modelers</Title>
            <img src={bpmn_example} alt="Logo" width="300px"/>
            <BtnGotoHome/>
        </div>
    );
}

export default Modeler;