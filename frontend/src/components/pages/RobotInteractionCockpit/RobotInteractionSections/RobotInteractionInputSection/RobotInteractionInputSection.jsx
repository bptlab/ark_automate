/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, Space } from 'antd';
import RobotInteractionInputParameter from './subComponents/RobotInteractionParameterInput';

const { Title } = Typography;

/**
 * @description Renders all necessary input fields for inserting the missing parameters before executing a robot
 * @category Frontend
 * @component
 */
const RobotInteractionInputSection = ({
  parameterList,
  updateParameterValue,
}) => (
  <Space size='small' direction='vertical' style={{ width: '100%' }}>
    {parameterList.map((activityInformation, index) => {
      if (activityInformation.activityParameter.length > 0) {
        return (
          <Card key={index}>
            <Title style={{ marginBottom: '0px' }} level={4}>
              Activity: {activityInformation.activityName}
            </Title>
            {activityInformation.activityParameter.map((params) => (
              <RobotInteractionInputParameter
                key={params._id}
                parameterName={params.name}
                isRequired={params.isRequired}
                dataType={params.type}
                infoText={params.infoText}
                updateParameterValue={updateParameterValue}
                parameterId={params._id}
              />
            ))}
          </Card>
        );
      }
      return <div />;
    })}
  </Space>
);

RobotInteractionInputSection.propTypes = {
  parameterList: PropTypes.arrayOf(PropTypes.shape).isRequired,
  updateParameterValue: PropTypes.func.isRequired,
};

export default RobotInteractionInputSection;
