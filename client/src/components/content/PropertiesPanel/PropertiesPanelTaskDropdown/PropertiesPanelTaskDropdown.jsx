import React from 'react';
import { Select } from 'antd';
import '../PropertiesPanel.css';

const { Option } = Select;

/**
 * @component
 * @description Renders the task-dropdown based on passed list of task.
 */
const PropertiesPanelTaskDropdown = (props) => {
  return (
    <>
      <Select
        className='properties-panel-dropdown'
        showSearch
        placeholder='Please select task'
        onChange={props.onTaskSelection}
        disabled={props.disabled ? true : null}
        defaultValue={props.currentSelection}
      >
        {props.listOfTasks.map((task) => (
          <Option value={task}>{task}</Option>
        ))}
      </Select>
    </>
  );
};

export default PropertiesPanelTaskDropdown;
