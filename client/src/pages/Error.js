import React from 'react';
import BtnGotoHome from '../components/BtnGotoHome.jsx';
import BtnGotoModeler from '../components/BtnGotoModeler.jsx';
import { Typography } from 'antd';
import HeaderNavbar from '../components/headerNavbar/HeaderNavbar';

const { Title } = Typography;

const Error = () => {
    return (
        <div>
            <HeaderNavbar selectedKey={3} />
            <Title>Error: Page does not exist!</Title>
            <BtnGotoHome />
            <br />
            <BtnGotoModeler />
        </div>
    );
}

export default Error;
