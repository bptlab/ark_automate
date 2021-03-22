/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import styles from '../../ModelerSidebar.module.css';

const { Option } = Select;

/**
 * @description Renders the application-dropdown based on passed list of applications.
 * @category Client
 * @component
 */
const PPApplicationDropdown = ({
  currentSelection,
  onApplicationSelection,
  applications,
}) => {
  /*   const [currentSelection, setCurrentSelection] = useState([]);
    const [exampleState, setExampleState] = useState([]); */

  console.log(currentSelection)

  /* useEffect(() => {
    getCurrentApplicationForActivity().then(response => {
      setCurrentSelection(response);
    })
  }, [])

  useEffect(() => {
    if (currentSelection && currentSelection.length > 0) {
      setCurrentSelection(currentSelection)
      console.log(currentSelection)
    }
  }, [currentSelection]) */

  return (
    <>
      <Select
        className={styles['properties-panel-dropdown']}
        showSearch
        placeholder='Please select application'
        onChange={onApplicationSelection}
        defaultValue={currentSelection}
      >
        {applications.map((applicaton) => (
          <Option key={applicaton} value={applicaton}>
            {applicaton}
          </Option>
        ))}
      </Select>
    </>
  )
};

export default PPApplicationDropdown;
