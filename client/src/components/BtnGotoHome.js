import React from 'react'

import {NavLink} from 'react-router-dom';
import {Button} from 'antd';

const gotoHome = () => {
    return (
        <div>
            <NavLink to="/">
                <Button type="primary">Go to Home</Button>
            </NavLink>
        </div>
    );
}

export default gotoHome;
 
 
