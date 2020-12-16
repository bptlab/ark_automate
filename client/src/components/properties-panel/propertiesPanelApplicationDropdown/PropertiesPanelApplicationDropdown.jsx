import React from 'react';
import { Select } from 'antd';
import '../propertiesView/PropertiesView.css'

const { Option } = Select;

/**
 * @class
 * @component
 * @classdesc Renders the application-dropdown based on passed list of applications.
 * @example 
 * let applicationList = ['MS Excel', 'Browser'];
 * let handleApplicationSelection = (event) => return 'successfully handled application selection';
 * return (
 *  <PropertiesPanelApplicationDropdown
 *      onApplicationSelection={this.handleApplicationSelection}
 *      applications={this.applicationList}
 *      currentSelection={'Element 1'} />
 * )
 */

export default function PropertiesPanelApplicationDropdown(props) {
    return <>
        <Select
            showSearch
            style={{ width: '100%', marginTop: '10px' }}
            placeholder="Please select application"
            onChange={props.onApplicationSelection}
            defaultValue={props.currentSelection}
        >
            {props.applications.map((application) => (
                <Option value={application}>{application}</Option>
            ))}
        </Select>
    </>
}
