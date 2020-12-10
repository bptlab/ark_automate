import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';

const gotoModeler = () => {
    return (
        <NavLink to="/modeler">
            <Button style={{ marginLeft: '30px' }} type="primary">Go to Modeler</Button>
        </NavLink>
    );
}

export default gotoModeler;