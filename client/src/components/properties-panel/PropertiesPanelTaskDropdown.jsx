import React from 'react';

export default function PropertiesPanelTaskDropdown (props) {
    return <>
        <select onChange={props.onTaskSelection} disabled={props.disabled ? true : null}>
            <option value='' disabled selected>
                Please Select
            </option>{
                props.listOfTasks.map((task) => (
                    <option value={task}>{task}</option>
                ))}
        </select>
    </>
}