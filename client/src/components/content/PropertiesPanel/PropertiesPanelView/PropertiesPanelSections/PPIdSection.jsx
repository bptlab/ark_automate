import React from 'react';
import { Space, Typography } from 'antd';
import styles from '../../PropertiesPanel.module.css';

const { Text } = Typography;

/**
 * @description Renders the task-dropdown based on passed list of task.
 * @category Client
 * @component
 */
const PPIdSection = (element) => (
    <Space direction='horizontal' style={{ width: '100%' }}>
        <Text className={styles[`label-on-dark-background`]}>ID: </Text>
        <Text className={styles[`label-on-dark-background`]}>{element.element.id}</Text>
    </Space>
);

export default PPIdSection;
