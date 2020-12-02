import React, { Component } from 'react';

import updateTaskListForSelectedApplication from './PropertiesView.jsx'

export default class PropertiesPanelTaskDropdown extends Component {
    render() {
        let dropdownOptions = this.props.list;

        return <>
            <select onChange={updateTaskListForSelectedApplication}>
                <option value='' disabled selected>
                    Please Select
                </option>{
                    //create <option> entries from props-list
                    dropdownOptions.map((task) => (
                        <option value={task}>{task}</option>
                    ))}
            </select>
        </>
    }
}