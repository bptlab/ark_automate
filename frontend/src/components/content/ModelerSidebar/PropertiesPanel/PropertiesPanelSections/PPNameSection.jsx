import React from 'react';
import PropTypes from 'prop-types';
import { Input, Typography, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import corporateDesign from '../../../../../layout/corporateDesign';

const { Text } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Frontend
 * @component
 */
const PPNameSection = ({ element, nameChanged }) => (
  <>
    <Text className='label-on-dark-background'>Name:</Text>
    <Input
      placeholder='name'
      suffix={
        <Tooltip title='The name of your task, gateway or event'>
          <InfoCircleOutlined
            style={{ color: corporateDesign.colorPrimaryInverted }}
          />
        </Tooltip>
      }
      value={element.businessObject.name || ''}
      onChange={nameChanged}
    />
  </>
);

PPNameSection.propTypes = {
  element: PropTypes.objectOf(PropTypes.shape).isRequired,
  nameChanged: PropTypes.func.isRequired,
};

export default PPNameSection;
