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
  parameterList,
  onValueChange,
  robotId,
}) => (
  <>
    <Text className='label-on-dark-background'>Parameter:</Text>

    <Space direction='vertical' style={{ width: '100%' }}>
      {parameterList.map((singleInput) => (
        <>
          <PPParameterInput
            onValueChange={onValueChange}
            parameterName={singleInput.name}
            isRequired={singleInput.isRequired}
            dataType={singleInput.type}
            value={singleInput.value}
            infoText={singleInput.infoText}
            robotId={robotId}
            selectedActivity={selectedActivity}
          />
        </>
      ))}
    </Space>
  </>
);

PPParameterSection.propTypes = {
  selectedActivity: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  parameterList: PropTypes.arrayOf(PropTypes.shape).isRequired,
  robotId: PropTypes.string.isRequired,
};

export default PPParameterSection;
