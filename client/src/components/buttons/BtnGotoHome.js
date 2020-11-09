import React from 'react'

import { NavLink } from 'react-router-dom';

const gotoHome = () => {
    return (
       <div>
          <NavLink to="/">
            <button>Go to Home</button>
          </NavLink>
       </div>
    );
}
 
export default gotoHome;
 
 
