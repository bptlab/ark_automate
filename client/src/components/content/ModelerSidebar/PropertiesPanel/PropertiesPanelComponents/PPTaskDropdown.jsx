/* eslint-disable react/prop-types */
import React from 'react';
import { Select } from 'antd';
import styles from '../../ModelerSidebar.module.css';

const { Option } = Select;

/**
 * @description Renders the task-dropdown based on passed list of task.
 * @category Client
 * @component
 */
const PPTaskDropdown = ({
  onTaskSelection,
  disabled,
  currentSelection,
  listOfTasks,
}) => (
  <>
    <Select
      className={styles['properties-panel-dropdown']}
      showSearch
      placeholder='Please select task'
      onChange={onTaskSelection}
      disabled={disabled ? true : null}
      defaultValue={currentSelection}
      value={currentSelection}
    >
      {listOfTasks.map((task) => (
        <Option key={task} value={task}>
          {task}
        </Option>
      ))}
    </Select>
  </>
);

export default PPTaskDropdown;
