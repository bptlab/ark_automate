import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button } from 'antd';

const gotoModeler = () => {
    return (
        <div>
            <NavLink to="/modeler">
                <Button type="primary">Go to Modeler</Button>
            </NavLink>
        </div>
    );
}

export default gotoModeler;