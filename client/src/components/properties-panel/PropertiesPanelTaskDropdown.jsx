import React, { Component } from 'react';

export default class PropertiesPanelTaskDropdown extends Component {
    render() {
        let dropdownOptions = this.props.list;
        console.log("Render with Options: " + dropdownOptions);

        return (
            <select>
                <option value='' disabled selected>
                    Please Select
                </option>{
                    //create <option> entries from props-list
                    dropdownOptions.map((task) => (
                        <option value={task}>{task}</option>
                    ))}
            </select>
        )
    }
}