/* eslint-disable react/prop-types */
import React from 'react';
import { Select } from 'antd';
import '../PropertiesPanel.css';

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
      className='properties-panel-dropdown'
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
