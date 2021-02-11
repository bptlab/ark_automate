/* eslint-disable react/prop-types */
import React from 'react';
import { Select } from 'antd';
import styles from '../PropertiesPanel.module.css';

const { Option } = Select;

/**
 * @description Renders the application-dropdown based on passed list of applications.
 * @category Client
 * @component
 */
const PropertiesPanelApplicationDropdown = ({
  onApplicationSelection,
  currentSelection,
  applications,
}) => (
  <>
    <Select
      className={styles['properties-panel-dropdown']}
      showSearch
      placeholder='Please select application'
      onChange={onApplicationSelection}
      defaultValue={currentSelection}
    >
      {applications.map((application) => (
        <Option key={application} value={application}>
          {application}
        </Option>
      ))}
    </Select>
  </>
);

export default PropertiesPanelApplicationDropdown;
