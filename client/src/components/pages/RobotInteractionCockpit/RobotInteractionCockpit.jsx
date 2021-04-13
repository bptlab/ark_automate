import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Card, Steps, Space, Button, Typography } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import RobotInteractionInputSection from '../../content/RobotInteractionSections/RobotInteractionInputSection';
import { getAllRequireUserInputParameters } from '../../../api/ssotRetrieval';
import socket from '../../../utils/socket/socketConnections';
import { upsert } from '../../../utils/attributeAndParamUtils';
import styles from './RobotInteractionCockpit.module.css';

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

  /**
   * @description For each activity of the current robot get the id, the name and all the parameters that require a user input
   */
  const getActivityAndParameterInformation = useCallback(() => {
    getAllRequireUserInputParameters(robotId)
      .then((response) => response.json())
      .then((parameterObjects) => {
        const activityInformationList = [];
        Array.prototype.forEach.call(parameterObjects, (parameterObject) => {
          const { activityId } = parameterObject;
          let activityName = '';
          let ssot = sessionStorage.getItem('ssotLocal');
          ssot = JSON.parse(ssot);
          Array.prototype.forEach.call(ssot.elements, (elem) => {
            if (elem.id === activityId) {
              activityName = elem.name;
            }
          });
          const activityParameter = [];
          Array.prototype.forEach.call(
            parameterObject.rpaParameters,
            (parameter) => {
              if (parameter.requireUserInput) {
                activityParameter.push(parameter);
              }
            }
          );
          if (activityParameter.length !== 0) {
            const activityInformation = [
              activityId,
              activityParameter,
              activityName,
            ];
            activityInformationList.push(activityInformation);
          }
        });
        if (isMounted.current) {
          setParameterList(activityInformationList);
        }
      });
  }, [robotId]);

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(
    () => () => {
      isMounted.current = true;
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
  const startRobot = () => {
    // isBotExecutable function is to be implemented
    const isBotExecutable = true;
    if (isBotExecutable) {
      upsert().then(() => {
        setCurrentStep(1);
        socket.emit('robotExecutionJobs', { robotId, userId });
      });
    } else {
      alert('Your Bot is not fully configured and can not be executed!');
    }
  };

  return (
    <Layout>
      <HeaderNavbar selectedKey={4} />
      <Card>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Steps current={currentStep}>
            <Step title='Input' description='Define input for robot' />
            <Step title='Execution' description='Check current status' />
            <Step title='Done' description='Get return value' />
          </Steps>
          {currentStep === 0 && parameterList.length !== 0 && (
            <>
              <RobotInteractionInputSection parameterList={parameterList} />
              <Space
                direction='horizontal'
                size='large'
                style={{ width: '100%' }}
              >
                <Button
                  type='primary'
                  className={styles.button}
                  onClick={upsert}
                >
                  Save changes to cloud
                </Button>
                <Button type='primary' onClick={startRobot}>
                  Execute Robot
                </Button>
              </Space>
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
