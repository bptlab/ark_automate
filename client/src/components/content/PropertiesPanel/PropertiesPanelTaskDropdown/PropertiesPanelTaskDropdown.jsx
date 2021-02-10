/* eslint-disable react/prop-types */
import React from 'react';
import { Select } from 'antd';
import '../PropertiesPanel.css';

const { Option } = Select;

/**
 * @description Renders the task-dropdown based on passed list of task.
 * @category Client
 * @component
 */
const PropertiesPanelTaskDropdown = ({
  onTaskSelection,
  disabled,
  currentSelection,
  listOfTasks,
}) => (
  <>
    <Select
      className='properties-panel-dropdown'
      showSearch
      placeholder='Please select task'
      onChange={onTaskSelection}
      disabled={disabled ? true : null}
      defaultValue={currentSelection}
    >
      {listOfTasks.map((task) => (
        <Option key={task} value={task}>
          {task}
        </Option>
      ))}
    </Select>
  </>
);

export default PropertiesPanelTaskDropdown;
