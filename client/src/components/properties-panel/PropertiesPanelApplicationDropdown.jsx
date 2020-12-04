import React, { Component } from 'react';

/*  ToDo: actually the tasklist ist not passed to the parents component 
*/

var applicationToTaskMap = new Map();
var taskList = [];

export default class PropertiesPanelTaskDropdown extends Component {
    updateTaskListForSelectedApplication(event) {
        console.log("triggered00");
        let selectedApplication = event.target.value;
        console.log(selectedApplication);
        if (applicationToTaskMap.has(selectedApplication)) {
            taskList = applicationToTaskMap.get(selectedApplication);
        } else {
            (async () => {
                taskList = await fetchTasksForApplication(selectedApplication);
            })()
        }

        async function fetchTasksForApplication(value) {
            return await fetch('get-available-tasks-for-application?application=' + value.replace(' ', '+'))
                .then((response) => response.json())
                .then(data => {
                    console.log('fetched data: ' + data);
                    applicationToTaskMap.set(value, data);
                    return data;
                })
        };
    }

    render() {
        let dropdownOptions = this.props.list;

        return <>
            <select onChange={this.updateTaskListForSelectedApplication}>
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