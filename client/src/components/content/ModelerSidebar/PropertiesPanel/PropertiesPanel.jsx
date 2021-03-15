import { is } from 'bpmn-js/lib/util/ModelUtil';
import React from 'react';
import { Space } from 'antd';
import PropTypes from 'prop-types'

import PPIdSection from './PropertiesPanelSections/PPIdSection';
import PPTitle from './PropertiesPanelSections/PPTitleSection'
import PPNameSection from './PropertiesPanelSections/PPNameSection';
import PPRpaSection from './PropertiesPanelSections/PPRpaSection';
import PPOutputValueSection from './PropertiesPanelSections/PPOutputValueSection'

/**
 * @description Shows PropertiesPanel for one selected BPMN-Element.
 * @category Client
 * @component
 */
const PropertiesPanelView = ({
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
          <PPOutputValueSection />
        </>
      )}
    </Space>
  </div >
);

PropertiesPanelView.propTypes = {
  element: PropTypes.objectOf(PropTypes.shape).isRequired,
  nameChanged: PropTypes.func.isRequired,
  applicationSelectionUpdated: PropTypes.func.isRequired,
  tasksForSelectedApplication: PropTypes.arrayOf(PropTypes.shape).isRequired,
  taskSelectionUpdated: PropTypes.func.isRequired,
  disableTaskSelection: PropTypes.bool.isRequired
};

export default PropertiesPanelView;
