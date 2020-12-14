import React from 'react';

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
        <select onChange={props.onTaskSelection} disabled={props.disabled ? true : null}>
            <option value='' disabled selected>
                Please Select
            </option>{
                props.listOfTasks.map((task) => (
                    <option value={task} selected={(task === props.currentSelection)}>{task}</option>
                ))}
        </select>
    </>
}
