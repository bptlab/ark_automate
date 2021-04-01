import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Card, Steps, Space } from 'antd';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import RobotInteractionInputSection from '../../content/RobotInteractionSections/RobotInteractionInputSection';
import { getAllRequireUserInputParameters } from '../../../api/ssotRetrieval';

const { Step } = Steps;
/**
 * @description Page, where you can interact with a robot and for example enter input
 * @category Client
 * @component
 */
const RobotInteractionCockpit = (match) => {
  const { robotId } = match.match.params;
  const isMounted = useRef(true);
  const [parameterList, setParameterList] = useState([]);

  const getParameterRequireUserInput = useCallback(() => {
    getAllRequireUserInputParameters(robotId)
      .then((response) => response.json())
      .then((parameterObjects) => {
        const activityParameterTupels = [];
        Array.prototype.forEach.call(parameterObjects, (parameterObject) => {
          const { activityId } = parameterObject;
          let activityParamterTupel;
          Array.prototype.forEach.call(
            parameterObject.rpaParameters,
            (parameter) => {
              if (parameter.requireUserInput) {
                activityParamterTupel = [activityId, parameter];
                activityParameterTupels.push(activityParamterTupel);
              }
            }
          );
        });
        if (isMounted.current) {
          setParameterList(activityParameterTupels);
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

  useEffect(() => {
    getParameterRequireUserInput();
  }, [getParameterRequireUserInput]);

  /**
   * @description Sends a job to the server to execute a specfic robot for a specific user
   */
  const startRobot = () => {
    // isBotExecutable function is to be implemented
    const isBotExecutable = true;
    if (isBotExecutable) {
      socket.emit('robotExecutionJobs', { robotId, userId });
    } else {
      alert('Your Bot is not fully configured and can not be executed!');
    }
  };

  return (
    <Layout>
      <HeaderNavbar selectedKey={4} />
      <Card>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Steps current={0}>
            <Step title='Input' description='Define input for robot' />
            <Step title='Execution' description='Check current status' />
            <Step title='Done' description='Get return value' />
          </Steps>
          <RobotInteractionInputSection parameterList={parameterList} />
        </Space>
      </Card>
    </Layout>
  );
};

export default RobotInteractionCockpit;
