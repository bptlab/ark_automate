import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import styles from '../../../../ModelerSidebar.module.css';
import { getRpaTask } from '../../../../../../../../utils/sessionStorage/localSsotController/attributes';

const { Option } = Select;

/**
 * @description Renders the task-dropdown based on passed list of task.
 * @category Frontend
 * @component
 */
const PPTaskDropdown = ({
  onTaskSelection,
  disabled,
  listOfTasks,
  selectedActivity,
}) => (
  <>
    <Select
      className={styles['properties-panel-dropdown']}
      showSearch
      placeholder='Please select task'
      onChange={onTaskSelection}
      disabled={disabled ? true : null}
      defaultValue={getRpaTask(selectedActivity)}
    >
      {listOfTasks.map((task) => (
        <Option key={task} value={task}>
          {task}
        </Option>
      ))}
    </Select>
  </>
);

PPTaskDropdown.propTypes = {
  listOfTasks: PropTypes.arrayOf(PropTypes.shape).isRequired,
  onTaskSelection: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  selectedActivity: PropTypes.string.isRequired,
};

export default PPTaskDropdown;
