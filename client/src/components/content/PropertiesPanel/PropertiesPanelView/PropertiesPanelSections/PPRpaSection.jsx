import React from 'react';
import { Typography, Space } from 'antd';
import PropTypes from 'prop-types'
import PropertiesPanelApplicationDropdown from '../../PropertiesPanelApplicationDropdown/PropertiesPanelApplicationDropdown';
import PropertiesPanelTaskDropdown from '../../PropertiesPanelTaskDropdown/PropertiesPanelTaskDropdown';
import styles from '../../PropertiesPanel.module.css';

const { Text } = Typography;

/**
 * @description Renders the RPA-Input fields if BPMN element is an activity
 * @category Client
 * @component
 */
const PPNameSection = ({
    element,
    applicationSelectionUpdated,
    tasksForSelectedApplication,
    taskSelectionUpdated,
    disableTaskSelection,
}) => (
    <>
        <Text className={styles[`label-on-dark-background`]}>Actions: </Text>
        <Space direction='vertical' style={{ width: '100%' }}>
            <PropertiesPanelApplicationDropdown
                onApplicationSelection={applicationSelectionUpdated}
                applications={sessionStorage
                    .getItem('AvailableApplications')
                    .split(',')}
                currentSelection={
                    element.businessObject.$attrs['arkRPA:application']
                }
            />
            <PropertiesPanelTaskDropdown
                listOfTasks={tasksForSelectedApplication}
                onTaskSelection={taskSelectionUpdated}
                disabled={disableTaskSelection}
                currentSelection={element.businessObject.$attrs['arkRPA:task']}
            />
        </Space>
    </>
);

PPNameSection.propTypes = {
    element: PropTypes.objectOf(PropTypes.shape).isRequired,
    applicationSelectionUpdated: PropTypes.func.isRequired,
    tasksForSelectedApplication: PropTypes.arrayOf(PropTypes.shape).isRequired,
    taskSelectionUpdated: PropTypes.func.isRequired,
    disableTaskSelection: PropTypes.bool.isRequired
};

export default PPNameSection;
