import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';

const gotoHome = () => {
    return (
        <NavLink to="/">
            <Button style={{ marginLeft: '30px' }} type="primary">Go to Home</Button>
        </NavLink>
    );
}

export default gotoHome;