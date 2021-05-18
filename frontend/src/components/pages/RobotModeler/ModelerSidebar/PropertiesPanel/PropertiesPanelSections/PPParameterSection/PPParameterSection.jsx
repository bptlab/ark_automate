/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Space } from 'antd';
import PPParameterInput from './subComponents/PPParameterInput';

const { Text } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Frontend
 * @component
 */
const PPParameterSection = ({
  selectedActivity,
  variableList,
  onValueChange,
  robotId,
}) => (
  <>
    <Text className='label-on-dark-background'>Parameter:</Text>

    <Space direction='vertical' style={{ width: '100%' }}>
      {variableList.map((singleInput, index) => (
        <PPParameterInput
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          onValueChange={onValueChange}
          variableName={singleInput.name}
          isRequired={singleInput.isRequired}
          dataType={singleInput.type}
          value={singleInput.value}
          infoText={singleInput.infoText}
          robotId={robotId}
          selectedActivity={selectedActivity}
        />
      ))}
    </Space>
  </>
);

PPParameterSection.propTypes = {
  selectedActivity: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  variableList: PropTypes.arrayOf(PropTypes.shape).isRequired,
  robotId: PropTypes.string.isRequired,
};

export default PPParameterSection;
