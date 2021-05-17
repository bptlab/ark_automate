import React from 'react';
import { Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * @description Renders the task-dropdown based on passed list of task.
 * @category Frontend
 * @component
 */
const PPIdSection = (element) => {
  const { element: selectedElement } = element;
  const { id } = selectedElement;
  return (
    <Space direction='horizontal' style={{ width: '100%' }}>
      <Text className='label-on-dark-background'>ID: </Text>
      <Text className='label-on-dark-background'>{id}</Text>
    </Space>
  );
};

export default PPIdSection;
