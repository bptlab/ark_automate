import React from 'react';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Space } from 'antd';
import PropTypes from 'prop-types'

import PPIdSection from './PropertiesPanelSections/PPIdSection';
import PPTitle from './PropertiesPanelSections/PPTitleSection'
import PPNameSection from './PropertiesPanelSections/PPNameSection';
import PPRpaSection from './PropertiesPanelSections/PPRpaSection';
import PPOutputValueSection from './PropertiesPanelSections/PPOutputValueSection'

const outputVariableText = 'GetCell returns the value of the specified cell!';

/**
 * @description Shows PropertiesPanel for one selected BPMN-Element.
 * @category Client
 * @component
 */
const PropertiesPanel = ({
  element,
  nameChanged,
  applicationSelectionUpdated,
  tasksForSelectedApplication,
  taskSelectionUpdated,
  disableTaskSelection
}) => (
  < div className='element-properties' key={element.id} >
    <Space direction='vertical' style={{ width: '100%' }}>
      <PPTitle element={element} />
      <PPIdSection element={element} />
      <PPNameSection element={element} nameChanged={nameChanged} />

      {is(element, 'bpmn:Task') && (
        <>
          <PPRpaSection
            element={element}
            applicationSelectionUpdated={applicationSelectionUpdated}
            tasksForSelectedApplication={tasksForSelectedApplication}
            taskSelectionUpdated={taskSelectionUpdated}
            disableTaskSelection={disableTaskSelection}
          />
          {(outputVariableText && <PPOutputValueSection outputVariableText={outputVariableText} />)}
        </>
      )}
    </Space>
  </div >
);

PropertiesPanel.propTypes = {
  element: PropTypes.objectOf(PropTypes.shape).isRequired,
  nameChanged: PropTypes.func.isRequired,
  applicationSelectionUpdated: PropTypes.func.isRequired,
  tasksForSelectedApplication: PropTypes.arrayOf(PropTypes.shape).isRequired,
  taskSelectionUpdated: PropTypes.func.isRequired,
  disableTaskSelection: PropTypes.bool.isRequired
};

export default PropertiesPanel;
