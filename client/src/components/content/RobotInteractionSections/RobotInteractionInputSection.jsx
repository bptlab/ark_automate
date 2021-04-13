import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Space } from 'antd';
import RobotInteractionInputParameter from './RobotInteractionComponents/RobotInteractionInputParameter';

const { Title } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Client
 * @component
 */
const RobotInteractionInputSection = ({ parameterList }) => (
  <Space size='small' direction='vertical' style={{ width: '100%' }}>
    {parameterList.map((activityInformation) => {
      if (activityInformation.activityParameter.length !== 0) {
        return (
          <>
            <Title style={{ marginBottom: '0px' }} level={4}>
              Activity: {activityInformation.activityName}
            </Title>
            {activityInformation.activityParameter.map((params) => (
              <RobotInteractionInputParameter
                variableName={params.name}
                isRequired={params.isRequired}
                dataType={params.type}
                value={params.value}
                activityId={activityInformation.activityId}
                infoText={params.infoText}
              />
            ))}
          </>
        );
      }
    })}
  </Space>
);

RobotInteractionInputSection.propTypes = {
  parameterList: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default RobotInteractionInputSection;
