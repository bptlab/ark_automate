import React from 'react';
import { Space, Typography, Tooltip, Input } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import corporateDesign from '../../../../../layout/corporateDesign';

const { Text } = Typography;

/**
 * @description Renders the OutputValue-Section for activities.
 * @category Frontend
 * @component
 */
const PPOutputValueSection = ({ outputVariableText, onNameChange }) => {
  const handleOutputVariableChange = (event) => {
    const outputValueName = event.target.value.replace(/\$/g, '');
    onNameChange(outputValueName);
  };

  return (
    <>
      <Space>
        <Text className='label-on-dark-background'>OutputValue: </Text>
        <Tooltip
          placement='bottom'
          title='The OutputValue is the return value of the RPA task. It can be used as input for following activities with $$outputValue$$.'
        >
          <InfoCircleOutlined
            style={{ color: corporateDesign.colorPrimaryInvertedText }}
          />
        </Tooltip>
      </Space>

      <Input
        placeholder='Please type in your outputValue name'
        defaultValue={outputVariableText}
        suffix={
          <Tooltip title={outputVariableText}>
            <InfoCircleOutlined
              style={{ color: corporateDesign.colorPrimaryInverted }}
            />
          </Tooltip>
        }
        onPressEnter={handleOutputVariableChange}
      />
    </>
  );
};

PPOutputValueSection.propTypes = {
  outputVariableText: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
};

export default PPOutputValueSection;
