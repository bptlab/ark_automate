/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { is } from 'bpmn-js/lib/util/ModelUtil';
import React from 'react';
import { Input, Tooltip, Typography } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { InfoCircleOutlined } from '@ant-design/icons';
import PropertiesPanelApplicationDropdown from '../PropertiesPanelApplicationDropdown/PropertiesPanelApplicationDropdown';
import PropertiesPanelTaskDropdown from '../PropertiesPanelTaskDropdown/PropertiesPanelTaskDropdown';
import styles from './PropertiesPanelView.module.css';
import '../PropertiesPanel.css';

const { Text } = Typography;

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
  disableTaskSelection,
}) => (
  <div className='element-properties' key={element.id}>
    <fieldset>
      <Text className={`label-on-dark-background ${styles.text}`}>
        {is(element, 'bpmn:Task')
          ? 'Activity'
          : is(element, 'bpmn:Event')
          ? 'Event'
          : is(element, 'bpmn:Gateway')
          ? 'Gateway'
          : ''}
      </Text>
    </fieldset>

    <fieldset>
      <Text className='label-on-dark-background'>ID: </Text>
      <Text className='label-on-dark-background'>{element.id}</Text>
    </fieldset>

    <fieldset>
      <Text className='label-on-dark-background'>Name:</Text>
      <Input
        className={styles.input}
        placeholder='name'
        suffix={
          <Tooltip title='the name of your task, gateway or event'>
            <InfoCircleOutlined className={styles.infoCircleOutlined} />
          </Tooltip>
        }
        value={element.businessObject.name || ''}
        onChange={nameChanged}
      />
    </fieldset>

    <fieldset>
      {is(element, 'bpmn:Task') && (
        <>
          <Text className='label-on-dark-background'>Actions: </Text>
          <br />
          <PropertiesPanelApplicationDropdown
            onApplicationSelection={applicationSelectionUpdated}
            applications={sessionStorage
              .getItem('AvailableApplications')
              .split(',')}
            currentSelection={
              element.businessObject.$attrs['arkRPA:application']
            }
          />
          <br />
          <PropertiesPanelTaskDropdown
            listOfTasks={tasksForSelectedApplication}
            onTaskSelection={taskSelectionUpdated}
            disabled={disableTaskSelection}
            currentSelection={element.businessObject.$attrs['arkRPA:task']}
          />
        </>
      )}
    </fieldset>
  </div>
);
export default PropertiesPanelView;
