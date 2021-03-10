import React, { useEffect } from 'react';
import { Layout } from 'antd';
import BpmnModeler from '../../content/BpmnModeler/BpmnModeler';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import { retrieveMetadataForBot } from '../../../api/SSOTretrieval';


const { Footer } = Layout;

/**
 * @description Modeler page that enables the user to build a robot
 * @category Client
 * @component
 */
const Modeler = (match) => {
  const { robotId } = match.match.params;
  let robotName;

  useEffect(() => {
    retrieveMetadataForBot(robotId)
      .then((response) => response.json())
      .then((data) => {
        robotName = data.robotName;
      })
  }, []);



  return (
    <div>
      <Layout>
        <HeaderNavbar selectedKey={2} />
        <BpmnModeler robotId={robotId} robotName={robotName} />
        <Footer>Fußzeile</Footer>
      </Layout>
    </div>
  )
};

export default Modeler;
