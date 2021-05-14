import React from 'react';
import { Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * @description Renders the task-dropdown based on passed list of task.
 * @category Frontend
 * @component
 */
const PPIdSection = (element) => (
  <Space direction='horizontal' style={{ width: '100%' }}>
    <Text className='label-on-dark-background'>ID: </Text>
    <Text className='label-on-dark-background'>{element.element.id}</Text>
  </Space>
);

export default PPIdSection;
