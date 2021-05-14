import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

/**
 * @description Renders the corresponding title for selected BPMN element
 * @category Frontend
 * @component
 */
const PPTitleSection = (element) => {
  let title = element.element.type;
  title = title.replace('bpmn:', '');

  return (
    <Text className='label-on-dark-background' style={{ fontSize: '24px' }}>
      {title}
    </Text>
  );
};

export default PPTitleSection;
