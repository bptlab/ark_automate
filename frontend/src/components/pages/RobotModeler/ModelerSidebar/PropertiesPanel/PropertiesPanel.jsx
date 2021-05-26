import React from 'react';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Space } from 'antd';
import PropTypes from 'prop-types';

import PPIdSection from './PropertiesPanelSections/PPIdSection/PPIdSection';
import PPTitle from './PropertiesPanelSections/PPTitleSection/PPTitleSection';
import PPNameSection from './PropertiesPanelSections/PPNameSection/PPNameSection';
import PPParameterSection from './PropertiesPanelSections/PPParameterSection/PPParameterSection';
import PPRpaSection from './PropertiesPanelSections/PPRpaSection/PPRpaSection';
import PPOutputValueSection from './PropertiesPanelSections/PPOutputValueSection/PPOutputValueSection';

/**
 * @description Shows PropertiesPanel for one selected BPMN-Element.
 * @category Frontend
 * @component
 */
const PropertiesPanel = ({
  element,
  nameChanged,
  applicationSelectionUpdated,
  tasksForSelectedApplication,
  selectedActivity,
  taskSelectionUpdated,
  disableTaskSelection,
  robotId,
  parameterList,
  parameterSelectionUpdated,
  outputValueName,
  outputNameUpdated,
}) => (
  <div className='element-properties' key={element.id}>
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
            selectedActivity={selectedActivity}
          />
          {parameterList.length > 0 && (
            <PPParameterSection
              selectedActivity={selectedActivity}
              parameterList={parameterList}
              onValueChange={parameterSelectionUpdated}
              robotId={robotId}
            />
          )}
          {outputValueName && (
            <PPOutputValueSection
              outputValueText={outputValueName}
              onNameChange={outputNameUpdated}
            />
          )}
        </>
      )}
    </Space>
  </div>
);

PropertiesPanel.defaultProps = {
  outputValueName: undefined,
};

PropertiesPanel.propTypes = {
  element: PropTypes.objectOf(PropTypes.shape).isRequired,
  nameChanged: PropTypes.func.isRequired,
  applicationSelectionUpdated: PropTypes.func.isRequired,
  tasksForSelectedApplication: PropTypes.arrayOf(PropTypes.shape).isRequired,
  taskSelectionUpdated: PropTypes.func.isRequired,
  selectedActivity: PropTypes.string.isRequired,
  disableTaskSelection: PropTypes.bool.isRequired,
  parameterList: PropTypes.arrayOf(PropTypes.shape).isRequired,
  parameterSelectionUpdated: PropTypes.func.isRequired,
  outputValueName: PropTypes.string,
  outputNameUpdated: PropTypes.func.isRequired,
  robotId: PropTypes.string.isRequired,
};

export default PropertiesPanel;
