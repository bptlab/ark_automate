import React from 'react';
import BtnGotoHome from '../components/BtnGotoHome';
import {Typography} from 'antd';
import BpmnModelerComponent from "../components/bpmn.modeler.component";


const {Title} = Typography;

const Modeler = () => {
    return (
        <div>
            {/*<Title>Seite unseres Modelers</Title>*/}
            <React.StrictMode>
                <BpmnModelerComponent/>
            </React.StrictMode>
            {/*<BtnGotoHome/>*/}
        </div>
    );
}

export default Modeler;
