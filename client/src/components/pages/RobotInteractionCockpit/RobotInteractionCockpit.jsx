/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Card, Steps, Space, Button, Typography } from 'antd';
import { Row, Col } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import RobotInteractionInputSection from '../../content/RobotInteractionSections/RobotInteractionInputSection';
import { isRobotExecutable } from '../../../utils/robotExecution';
import { startRobotForUser } from '../../../api/socketHandler/socketEmitter';
import { getActivityAndParameterInformation } from './RobotInteractionCockpitFunctionality';
import customNotification from '../../../utils/notificationUtils';

const { Step } = Steps;
const { Title } = Typography;

/**
 * @description Page, where you can interact with a robot and for example enter input
 * @category Client
 * @component
 */
const RobotInteractionCockpit = (match) => {
  const { robotId } = match.match.params;
  const { userId } = match.location.state;
  const isMounted = useRef(true);
  const [parameterList, setParameterList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [parameters, setParameters] = useState([]);
  const [logs, setLogs] = useState([
    {
      activity_name: 'Browser1',
      tasks: [
        { task_name: 'Capture Page Screenshot', status: 'PASS' },
        { task_name: 'Open Chrome Browser', status: 'FAIL' },
      ],
      status: 'FAIL',
      message:
        'BrowserNotFoundError: Failed to start a browser:\n- Chrome: Message: unknown error: cannot find Chrome binary\n\n',
    },
    {
      activity_name: 'Say hello',
      tasks: [{ task_name: 'Open Workbook', status: 'PASS' }],
      status: 'PASS',
      message: '',
    },
  ]);
  const [robotState, setRobotState] = useState('idle');

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
   * @description Sends a job to the server to execute a specfic robot for a specific user
   */
  const startRobot = async () => {
    const robotIsExecutable = await isRobotExecutable(robotId);
    if (robotIsExecutable) {
      setCurrentStep(1);
      startRobotForUser(userId, robotId, parameters);
      startLogDisplaying();
    } else {
      customNotification(
        'Error',
        'Your Bot is not fully configured and can not be executed!'
      );
    }
  };

  const startLogDisplaying = () => {
    // check in to socket room
    // when socket broadcasts message, setLogs(log.robot_run.activities)
    // if socket broadcast run complete, setCurrentStep(2)
  };

  /**
   * @description Will update the value of a parameter in the component state
   * @param {string} parameterId Id of the parameter which value will be changed
   * @param {string} value new value of the parameter
   */
  const updateParameterValue = (parameterId, value) => {
    const currentParameters = [...parameters];
    let found = false;
    for (let i = 0; i < currentParameters.length; i++) {
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
        <Steps current={currentStep}>
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
            <>
              <Row>
                <Col span={8}>
                  <Title style={{ marginBottom: '0px' }} level={5}>
                    Robot Status: {robotState}
                  </Title>
                </Col>
                <Col span={16}>
                  <Title style={{ marginBottom: '0px' }} level={5}>
                    Robot Run Logs
                  </Title>
                  {logs.map((log) => (
                    <Card>
                      <p>Activity: {log.activity_name}</p>
                      <p>Status: {log.status}</p>
                      {log.message && <p>Error Message: {log.message}</p>}
                    </Card>
                  ))}
                </Col>
              </Row>
            </>
          )}
        </Space>
      </Card>
    </Layout>
  );
};

export default RobotInteractionCockpit;
