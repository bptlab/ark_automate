import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Space, Form } from 'antd';
import RobotInteractionInputParameter from './RobotInteractionComponents/RobotInteractionInputParameter';

const { Text } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Client
 * @component
 */
const RobotInteractionInputSection = ({ parameterList }) => (
  <>
    <Space direction='vertical' style={{ width: '100%' }}>
      {parameterList.map((singleInput) => (
        <>
          <Text>{singleInput[1].name}</Text>
          <RobotInteractionInputParameter
            variableName={singleInput[1].name}
            isRequired={singleInput[1].isRequired}
            dataType={singleInput[1].type}
            value={singleInput[1].value}
          />
        </>
      ))}
    </Space>
  </>
);

RobotInteractionInputSection.propTypes = {
  parameterList: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default RobotInteractionInputSection;
