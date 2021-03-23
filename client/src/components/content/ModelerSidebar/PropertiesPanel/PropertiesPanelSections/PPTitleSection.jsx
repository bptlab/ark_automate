import React from 'react';
import { Typography } from 'antd';
import styles from '../../ModelerSidebar.module.css';

const { Text } = Typography;

/**
 * @description Renders the corresponding title for selected BPMN element
 * @category Client
 * @component
 */
const PPTitleSection = (element) => {
    let title = element.element.type;
    title = title.replace('bpmn:', '');

    return (
        <Text
            className={styles[`label-on-dark-background`]}
            style={{ fontSize: '24px' }}
        >
            {title}
        </Text>
    );
}

export default PPTitleSection;
