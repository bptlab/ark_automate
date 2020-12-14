import React from 'react';

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
 *      applications={this.applicationList} />
 * )
 */

export default function PropertiesPanelApplicationDropdown(props) {
    return <>
        <select onChange={props.onApplicationSelection}>
            <option value='' disabled selected>
                Please Select
            </option>{
                props.applications.map((application) => (
                    <option value={application} selected={(application === props.currentSelection)}>{application}</option>
                ))}
        </select>
    </>
}
