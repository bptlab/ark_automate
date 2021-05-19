/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Card, Steps, Space, Button, Typography } from 'antd';
import HeaderNavbar from '../../multiPageComponents/HeaderNavbar/HeaderNavbar';
import RobotInteractionInputSection from './RobotInteractionSections/RobotInteractionInputSection/RobotInteractionInputSection';
import RobotInteractionExecutionSection from './RobotInteractionSections/RobotInteractionExecutionSection/RobotInteractionExecutionSection';
import {
  isRobotExecutable,
  getActivityAndParameterInformation,
} from './robotInteractionCockpitFunctionality/robotInteractionCockpitFunctionality';
import { startRobotForUser } from '../../../api/socketHandler/socketEmitter';
import customNotification from '../../../utils/componentsFunctionality/notificationUtils';
import {
  newRobotMonitorUpdate,
  newRobotStatusUpdate,
} from '../../../api/socketHandler/socketListeners';

const { Step } = Steps;
const { Title } = Typography;

/**
 * @description View where you can interact with a robot and enter parameters
 * @category Frontend
 * @component
 */
const RobotInteractionCockpit = (match) => {
  const { robotId } = match.match.params;
  const { userId } = match.location.state;
  const isMounted = useRef(true);
  const [parameterList, setParameterList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [parameters, setParameters] = useState([]);
  const [logs, setLogs] = useState({});
  const [robotState, setRobotState] = useState('waiting');

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  /**
   * @description Ensures that we only update the paramterList when the paramters we fetch form the DB have changed
   */
  useEffect(() => {
    getActivityAndParameterInformation(robotId, setParameterList, isMounted);
  }, [robotId]);

  /**
   * @description When changing into execution step the listeners for status and log updates are enabled
   */
  useEffect(() => {
    newRobotMonitorUpdate(setLogs);
    newRobotStatusUpdate(setRobotState);
  }, [currentStep]);

  /**
   * @description Sends a job to the server to execute a specfic robot for a specific user
   */
  const startRobot = async () => {
    const robotIsExecutable = await isRobotExecutable(robotId);
    if (robotIsExecutable) {
      setCurrentStep(1);
      startRobotForUser(userId, robotId, parameters);
    } else {
      customNotification(
        'Error',
        'Your Bot is not fully configured and can not be executed!'
      );
    }
  };

  /**
   * @description Updates the value of a parameter in the component state
   * @param {string} parameterId Id of the parameter which value will be changed
   * @param {string} value New value of the parameter
   */
  const updateParameterValue = (parameterId, value) => {
    const currentParameters = [...parameters];
    let found = false;
    for (let i = 0; i < currentParameters.length; i += 1) {
      if (currentParameters[i].parameterId === parameterId) {
        found = true;
        break;
      }
    }
    if (found) {
      currentParameters.map((parameter) => {
        if (parameter.parameterId === parameterId) {
          // eslint-disable-next-line no-param-reassign
          parameter.value = value;
        }
        return parameter;
      });
    } else {
      currentParameters.push({ parameterId, value });
    }
    setParameters(currentParameters);
  };

  return (
    <Layout>
      <HeaderNavbar selectedKey={4} />
      <Card style={{ margin: '24px', borderRadius: '5px' }}>
        <Steps responsive current={currentStep}>
          <Step title='Input' description='Define input for robot' />
          <Step title='Execution' description='Observe Robot Run' />
          <Step title='Done' description='Get return value' />
        </Steps>
      </Card>
      <Card style={{ margin: '24px', marginTop: '0px' }}>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {currentStep === 0 && parameterList.length !== 0 && (
            <>
              <RobotInteractionInputSection
                parameterList={parameterList}
                updateParameterValue={updateParameterValue}
              />
              <Button type='primary' onClick={startRobot}>
                Execute Robot
              </Button>
            </>
          )}
          {currentStep === 0 &&
            (parameterList.length === 0 || parameterList === undefined) && (
              <>
                <Title style={{ marginBottom: '0px' }} level={5}>
                  No User Input Required. Ready to go!
                </Title>
                <Button type='primary' onClick={startRobot}>
                  Execute Robot
                </Button>
              </>
            )}
          {currentStep !== 0 && (
            <RobotInteractionExecutionSection
              executionLogs={logs}
              robotState={robotState}
            />
          )}
        </Space>
      </Card>
    </Layout>
  );
};

export default RobotInteractionCockpit;
