/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Card, Steps, Space, Button, Typography } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import RobotInteractionInputSection from '../../content/RobotInteractionSections/RobotInteractionInputSection';
import { getAllParametersForRobot } from '../../../api/variableRetrieval';
import { isRobotExecutable } from '../../../utils/robotExecution';
import { startRobotForUser } from '../../../api/socketHandler/socketEmitter';

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

  /**
   * @description For each activity of the current robot get the id, the name and all the parameters that require a user input
   */
  const getActivityAndParameterInformation = useCallback(() => {
    getAllParametersForRobot(robotId)
      .then((response) => response.json())
      .then((parameterObjects) => {
        if (parameterObjects.length > 0) {
          const activityInformationList = [];
          parameterObjects.forEach((parameterObject) => {
            const { activityId } = parameterObject;
            let activityName = '';
            const ssot = JSON.parse(sessionStorage.getItem('ssotLocal'));
            ssot.elements.forEach((element) => {
              if (element.id === activityId) {
                activityName = element.name;
              }
            });
            const activityParameter = [];
            parameterObject.rpaParameters.forEach((parameter) => {
              if (parameter.requireUserInput) {
                activityParameter.push(parameter);
              }
            });
            if (activityParameter.length > 0) {
              const activityInformation = {
                activityId,
                activityParameter,
                activityName,
              };
              activityInformationList.push(activityInformation);
            }
          });

          if (isMounted.current) {
            setParameterList(activityInformationList);
          }
        }
      });
  }, [robotId]);

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
    getActivityAndParameterInformation();
  }, [getActivityAndParameterInformation]);

  /**
   * @description Sends a job to the server to execute a specfic robot for a specific user
   */
  const startRobot = async () => {
    const robotIsExecutable = await isRobotExecutable(robotId);
    if (robotIsExecutable) {
      setCurrentStep(1);
      startRobotForUser(userId, robotId, parameters);
    } else {
      alert('Your Bot is not fully configured and can not be executed!');
    }
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
          <Step title='Execution' description='Check current status' />
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
        </Space>
      </Card>
    </Layout>
  );
};

export default RobotInteractionCockpit;
