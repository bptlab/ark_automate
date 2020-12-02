import React, { Component } from 'react';

export default class PPTaskDropdown extends Component {
    render() {
        let myOptions = this.props.list;
        console.log("Render with Options: " + myOptions);

        return (
            <select>
                <option value='' disabled selected>
                    Please Select
                </option>{
                    //create <option> entries from props-list
                    myOptions.map((task) => (
                        <option value={task}>{task}</option>
                    ))}
            </select>
        )
    }
}