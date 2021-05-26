import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import BpmnModeler from './BpmnModeler/BpmnModeler';
import HeaderNavbar from '../../multiPageComponents/HeaderNavbar/HeaderNavbar';
import ModelerSidebar from './ModelerSidebar/ModelerSidebar';
import { getSsot } from '../../../api/routes/robots/robots';
import { getAllParametersForRobot } from '../../../api/routes/robots/rpaParameter';
import { getAllAttributes } from '../../../api/routes/robots/rpaAttributes';
import { initSessionStorage } from '../../../utils/sessionStorage/sessionStorageUtils';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';

/**
 * @description Modeler page that enables the user to build a robot
 * @category Frontend
 * @component
 */
const RobotModeler = (props) => {
  const { match } = props;
  const { params } = match;
  const { robotId } = params;
  const [modeler, setModeler] = useState(null);
  const [robotName, setRobotName] = useState();

  const updateModeler = (updatedModeler) => {
    setModeler(updatedModeler);
  };

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    initSessionStorage('idCounter', JSON.stringify('541'));
    getSsot(robotId)
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('ssotLocal', JSON.stringify(data));
        setRobotName(data.robotName);
      })
      .catch((error) => {
        console.error(error);
      });

    getAllAttributes(robotId)
      .then((response) => response.json())
      .then((data) => {
        initSessionStorage('attributeLocalStorage', JSON.stringify([]));
        sessionStorage.setItem('attributeLocalStorage', JSON.stringify(data));
      });

    getAllParametersForRobot(robotId)
      .then((response) => response.json())
      .then((data) => {
        initSessionStorage('parameterLocalStorage', JSON.stringify([]));
        sessionStorage.setItem('parameterLocalStorage', JSON.stringify(data));
      });
  }, []);

  return (
    <>
      <HeaderNavbar selectedKey={2} />
      <Layout>
        <BpmnModeler
          robotId={robotId}
          robotName={robotName}
          onModelerUpdate={updateModeler}
        />
        {modeler && robotName && (
          <ModelerSidebar
            modeler={modeler}
            robotId={robotId}
            robotName={robotName}
          />
        )}
      </Layout>
    </>
  );
};

RobotModeler.propTypes = {
  match: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.objectOf(PropTypes.string),
    ])
  ).isRequired,
};

export default RobotModeler;
