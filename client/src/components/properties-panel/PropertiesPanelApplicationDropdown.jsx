import React from 'react';

export default function PropertiesPanelApplicationDropdown (props) {
    
    return <>
        <select onChange={props.onApplicationSelection}>
            <option value='' disabled selected>
                Please Select
            </option>{
            props.applications.map((application) => (
                    <option value={application}>{application}</option>
                ))}
        </select>
    </>
}