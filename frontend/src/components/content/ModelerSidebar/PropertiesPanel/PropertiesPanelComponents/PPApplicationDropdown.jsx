import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import styles from '../../ModelerSidebar.module.css';
import { getRpaApplication } from '../../../../../utils/sessionStorageUtils/localSsotController/attributes';

const { Option } = Select;

/**
 * @description Renders the application-dropdown based on passed list of applications.
 * @category Frontend
 * @component
 */
const PPApplicationDropdown = ({
  selectedActivity,
  onApplicationSelection,
  applications,
}) => (
  <>
    <Select
      className={styles['properties-panel-dropdown']}
      showSearch
      placeholder='Please select application'
      onChange={onApplicationSelection}
      defaultValue={getRpaApplication(selectedActivity)}
    >
      {applications.map((applicaton) => (
        <Option key={applicaton} value={applicaton}>
          {applicaton}
        </Option>
      ))}
    </Select>
  </>
);

PPApplicationDropdown.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape).isRequired,
  onApplicationSelection: PropTypes.func.isRequired,
  selectedActivity: PropTypes.string.isRequired,
};

export default PPApplicationDropdown;
