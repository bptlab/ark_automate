import React from 'react';
import { Select } from 'antd';
import '../PropertiesPanel.css';

const { Option } = Select;

/**
 * @description Renders the task-dropdown based on passed list of task.
 * @category Client
 * @component
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
          <Option key={task} value={task}>
            {task}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default PropertiesPanelTaskDropdown;
