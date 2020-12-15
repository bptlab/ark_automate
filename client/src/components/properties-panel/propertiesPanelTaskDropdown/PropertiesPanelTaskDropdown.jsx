import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

/**
 * @class
 * @component
 * @classdesc Renders the task-dropdown based on passed list of task.
 * @example 
 * let taskList = ['Open Browser', 'Close Browser'];
 * let handleTaskSelection = (event) => return 'successfully handled task selection';
 * let disableTaskSelection = false;
 * return (
 *  <PropertiesPanelTaskDropdown
 *      listOfTasks={this.taskList}
 *      onTaskSelection={this.handleTaskSelection}
 *      disabled={this.disableTaskSelection} />
 * )
 */

export default function PropertiesPanelTaskDropdown(props) {
    return <>
 
        <Select
            showSearch
            style={{ width: '100%', marginTop: '10px' }}
            placeholder="Please select task"
            onChange={props.onTaskSelection}
            disabled={props.disabled ? true : null}
            defaultValue={props.currentSelection}
        >
            {props.listOfTasks.map((task) => (
                <Option value={task}>{task}</Option>
            ))}
        </Select>
    </>
}
