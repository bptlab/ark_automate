import React from 'react';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Space } from 'antd';
import PropTypes from 'prop-types'

import PPIdSection from './PropertiesPanelSections/PPIdSection';
import PPTitle from './PropertiesPanelSections/PPTitleSection'
import PPNameSection from './PropertiesPanelSections/PPNameSection';
import PPParameterSection from './PropertiesPanelSections/PPParameterSection';
import PPRpaSection from './PropertiesPanelSections/PPRpaSection';
import PPOutputValueSection from './PropertiesPanelSections/PPOutputValueSection'

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
  disableTaskSelection,
  robotId,
  variableList,
  parameterUpdated,
  outputVariableName,
  outputNameUpdated
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
          {((variableList.length > 0) && <PPParameterSection variableList={variableList} onValueChange={parameterUpdated} />)}
          {(outputVariableName && <PPOutputValueSection outputVariableText={outputVariableName} onNameChange={outputNameUpdated}/>)}
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
  disableTaskSelection: PropTypes.bool.isRequired,
  variableList: PropTypes.arrayOf(PropTypes.shape).isRequired,
  parameterUpdated: PropTypes.func.isRequired,
  outputVariableName: PropTypes.string.isRequired,
  outputNameUpdated: PropTypes.func.isRequired,
};

export default PropertiesPanel;
