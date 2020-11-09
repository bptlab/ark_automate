import React from 'react';
import BtnGotoHome from '../components/buttons/BtnGotoHome';
import bpmn_example from '../bpmn_example.png'
 
const Modeler = () => {
    return (
       <div>
          <h1>Seite unseres Modelers</h1>
          <img src={bpmn_example} alt="Logo" width="300px"/>
          <BtnGotoHome />
       </div>
    );
}
 
export default Modeler;