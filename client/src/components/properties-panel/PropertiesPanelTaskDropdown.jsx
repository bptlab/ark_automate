import React, { Component } from 'react';

var applicationToTaskMap = new Map(); //TODO reimplement map to save time + ressources

export default class PropertiesPanelTaskDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedApplication : props.application,
            taskList : [],
            taskMap : {}
        };
    }

    render() {
        return (
            <select onChange={this.props.onTaskSelection} disabled={this.props.disabled ? true : null}>
                <option value='' disabled selected>
                    Please Select
                </option>{
                    this.props.listOfTasks.map((task) => (
                        <option value={task}>{task}</option>
                    ))}
            </select>
        )
    }
}