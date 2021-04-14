import React from 'react';
import { Typography, Space } from 'antd';
import PropTypes from 'prop-types';
import PropertiesPanelApplicationDropdown from '../PropertiesPanelComponents/PPApplicationDropdown';
import PropertiesPanelTaskDropdown from '../PropertiesPanelComponents/PPTaskDropdown';
import styles from '../../ModelerSidebar.module.css';

const { Text } = Typography;

/**
 * @description Renders the RPA-Input fields if BPMN element is an activity
 * @category Client
 * @component
 */
const PPRpaSection = ({
  applicationSelectionUpdated,
  tasksForSelectedApplication,
  taskSelectionUpdated,
  disableTaskSelection,
  selectedActivity,
}) => (
  <>
    <Text className={styles[`label-on-dark-background`]} strong>
      Actions:{' '}
    </Text>
    <Space direction='vertical' style={{ width: '100%' }}>
      <PropertiesPanelApplicationDropdown
        onApplicationSelection={applicationSelectionUpdated}
        applications={JSON.parse(
          sessionStorage.getItem('availableApplications')
        )}
        selectedActivity={selectedActivity}
      />
      <PropertiesPanelTaskDropdown
        listOfTasks={tasksForSelectedApplication}
        onTaskSelection={taskSelectionUpdated}
        disabled={disableTaskSelection}
        selectedActivity={selectedActivity}
      />
    </Space>
  </>
);

PPRpaSection.propTypes = {
  applicationSelectionUpdated: PropTypes.func.isRequired,
  selectedActivity: PropTypes.string.isRequired,
  tasksForSelectedApplication: PropTypes.arrayOf(PropTypes.shape).isRequired,
  taskSelectionUpdated: PropTypes.func.isRequired,
  disableTaskSelection: PropTypes.bool.isRequired,
};

export default PPRpaSection;
