import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from 'antd';
//import '.../App.css';


const gotoModeler = () => {
    return (
       <div>
         <Link to="/modeler">
            <button type="primary">Go to Modeler</button>
         </Link>
       </div>
    );
}
 
export default gotoModeler;
 
 
