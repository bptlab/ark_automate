import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import BpmnModeler from '../../content/BpmnModeler/BpmnModeler';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import ModelerSidebar from '../../content/ModelerSidebar/ModelerSidebar';
import { fetchSsot } from '../../../api/ssotRetrieval';
import { getAvailableApplications } from '../../../api/applicationAndTaskSelection';
import { setRobotId } from '../../../utils/attributeAndParamUtils';
import initSessionStorage from '../../../utils/sessionStorage';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';

/**
 * @description Modeler page that enables the user to build a robot
 * @category Client
 * @component
 */
const Modeler = (match) => {
  const { robotId } = match.match.params;
  const [modeler, setModeler] = useState(null);
  const [robotName, setRobotName] = useState();

  const updateModeler = (updatedModeler) => {
    setModeler(updatedModeler);
  }

  /**
   * @description Fetch all applications from MongoDB and save in session storage.
   */
  const saveAvailableApplicationsToSessionStorage = async () => {
    getAvailableApplications()
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('AvailableApplications', JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    fetchSsot(robotId)
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('ssotLocal', JSON.stringify(data));
        sessionStorage.setItem('robotName', data.robotName);
        setRobotName(data.robotName)
      })
      .catch((error) => {
        console.error(error);
      });
    setRobotId(robotId);
    initSessionStorage('TaskToApplicationCache', JSON.stringify({}));
    initSessionStorage('AvailableApplications', JSON.stringify([]));
    initSessionStorage('appTaskLocalStorage', JSON.stringify([]));
    initSessionStorage('parameterLocalStorage', JSON.stringify([]));
    let applicationList = sessionStorage.getItem('AvailableApplications');
    applicationList = JSON.parse(applicationList)
    if (applicationList.length < 1) saveAvailableApplicationsToSessionStorage();
  }, []);

  return (
    <>
      <HeaderNavbar selectedKey={2} />
      <Layout>
        <BpmnModeler robotId={robotId} robotName={robotName} onModelerUpdate={updateModeler} />
        {(modeler && robotName) && <ModelerSidebar modeler={modeler} robotId={robotId} robotName={robotName} />}
      </Layout>
    </>
  )
}

export default Modeler;
