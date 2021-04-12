import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Space, Form } from 'antd';
import RobotInteractionInputParameter from './RobotInteractionComponents/RobotInteractionInputParameter';

const { Text, Title } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Client
 * @component
 */
const RobotInteractionInputSection = ({ parameterList }) => (
  <>
    <Space size='small' direction='vertical' style={{ width: '100%' }}>
      {parameterList.map((activityParameterTupel) => {
        if (activityParameterTupel[1].length !== 0) {
          return (
            <>
              <Title style={{ marginBottom: '0px' }} level={4}>
                Activity: {activityParameterTupel[0]}
              </Title>
              {activityParameterTupel[1].map((params) => (
                <>
                  <Text strong>{params.name}</Text>
                  <RobotInteractionInputParameter
                    variableName={params.name}
                    isRequired={params.isRequired}
                    dataType={params.type}
                    value={params.value}
                    activityId={params}
                    infoText={params.infoText}
                  />
                </>
              ))}
            </>
          );
        }
      })}
    </Space>
  </>
);

RobotInteractionInputSection.propTypes = {
  parameterList: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default RobotInteractionInputSection;
