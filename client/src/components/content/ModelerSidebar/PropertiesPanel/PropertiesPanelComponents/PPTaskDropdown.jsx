import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types'
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
  listOfTasks,
  selectedActivity
}) => {
  const localStorage = JSON.parse(sessionStorage.getItem('appTaskLocalStorage'));
  const matchingEntry = localStorage.find((element) => (element.activityId === selectedActivity));

  let defaultValue;
  if (matchingEntry) {
    defaultValue = matchingEntry.rpaTask;
  }
  return (
    <>
      <Select
        className={styles['properties-panel-dropdown']}
        showSearch
        placeholder='Please select task'
        onChange={onTaskSelection}
        disabled={disabled ? true : null}
        defaultValue={defaultValue}
        value={defaultValue}
      >
        {listOfTasks.map((task) => (
          <Option key={task} value={task}>
            {task}
          </Option>
        ))}
      </Select>
    </>
  )
};

PPTaskDropdown.propTypes = {
  listOfTasks: PropTypes.arrayOf(PropTypes.shape).isRequired,
  onTaskSelection: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  selectedActivity: PropTypes.string.isRequired
};


export default PPTaskDropdown;
