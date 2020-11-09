import React from 'react';
import BtnGotoHome from '../components/BtnGotoHome';
import {Typography} from 'antd';

const {Title} = Typography;

const Error = () => {
    return (
        <div>
            <Title>Error: Page does not exist!</Title>
            <BtnGotoHome/>
        </div>
    );
}

export default Error;
