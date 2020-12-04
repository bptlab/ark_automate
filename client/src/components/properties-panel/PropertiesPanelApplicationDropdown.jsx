import React, { Component } from 'react';
import PropertiesPanelTaskDropdown from './PropertiesPanelTaskDropdown.jsx'

export default class PropertiesPanelApplicationDropdown extends Component {
    
    render() {
        return <>
            <select onChange={this.props.onApplicationSelection}>
                <option value='' disabled selected>
                    Please Select
                </option>{
                    //create <option> entries from props-list
                    this.props.applications.map((application) => (
                        <option value={application}>{application}</option>
                    ))}
            </select>
        </>
    }
}