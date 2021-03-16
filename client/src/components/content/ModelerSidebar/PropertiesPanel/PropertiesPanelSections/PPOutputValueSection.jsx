import React from 'react';
import { Space, Typography, Tooltip, Input } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import corporateDesign from '../../../../../layout/corporateDesign';
import styles from '../../ModelerSidebar.module.css';

const { Text } = Typography;

/**
 * @description Renders the OutputValue-Section for activities.
 * @category Client
 * @component
 */
const PPOutputValueSection = ({ outputVariableText }) => {
  const handleOutputVariableChange = (event) => {
    const outputValueName = event.target.value.replace(/\$/g, '')
    console.log(outputValueName)
  }

  return (<>
    <Space>
      <Text className={styles[`label-on-dark-background`]}>OutputValue: </Text>
      <Tooltip
        placement='bottom'
        title='The OutputValue is the return value of the RPA task. It can be used as input for following activities with $$outputValue$$.'
      >
        <InfoCircleOutlined style={{ color: corporateDesign.colorPrimaryInvertedText }} />
      </Tooltip>
    </Space>

    <Input
      placeholder='Please type in your outputValue name'
      suffix={
        <Tooltip title={outputVariableText}>
          <InfoCircleOutlined style={{ color: corporateDesign.colorPrimaryInverted }} />
        </Tooltip>
      }
      /* value={element.businessObject.name || ''} */
      onPressEnter={handleOutputVariableChange}
    />
  </>)
}

PPOutputValueSection.propTypes = {
  outputVariableText: PropTypes.string.isRequired
};

export default PPOutputValueSection;
