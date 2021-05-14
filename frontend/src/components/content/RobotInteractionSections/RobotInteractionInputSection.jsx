import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Space } from 'antd';
import RobotInteractionInputParameter from './RobotInteractionComponents/RobotInteractionInputParameter';

const { Title } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Frontend
 * @component
 */
const RobotInteractionInputSection = ({
  parameterList,
  updateParameterValue,
}) => (
  <Space size='small' direction='vertical' style={{ width: '100%' }}>
    {parameterList.map((activityInformation) => {
      if (activityInformation.activityParameter.length > 0) {
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
                infoText={params.infoText}
                updateParameterValue={updateParameterValue}
                // eslint-disable-next-line no-underscore-dangle
                parameterId={params._id}
              />
            ))}
          </>
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
