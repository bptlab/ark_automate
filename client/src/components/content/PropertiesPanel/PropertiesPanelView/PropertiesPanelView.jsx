/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { is } from 'bpmn-js/lib/util/ModelUtil';
import React from 'react';
import { Input, Tooltip, Typography, Space } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { InfoCircleOutlined } from '@ant-design/icons';
import PropertiesPanelApplicationDropdown from '../PropertiesPanelApplicationDropdown/PropertiesPanelApplicationDropdown';
import PropertiesPanelTaskDropdown from '../PropertiesPanelTaskDropdown/PropertiesPanelTaskDropdown';
import styles from '../PropertiesPanel.module.css';

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
    <Space direction='vertical' style={{ width: '100%', pading: '0rem' }}>
      <Text
        className={styles[`label-on-dark-background`]}
        style={{ fontSize: '24px' }}
      >
        {is(element, 'bpmn:Task')
          ? 'Activity'
          : is(element, 'bpmn:Event')
          ? 'Event'
          : is(element, 'bpmn:Gateway')
          ? 'Gateway'
          : ''}
      </Text>
      <Space direction='horizontal' style={{ width: '100%' }}>
        <Text className={styles[`label-on-dark-background`]}>ID: </Text>
        <Text className={styles[`label-on-dark-background`]}>{element.id}</Text>
      </Space>
      <Text className={styles[`label-on-dark-background`]}>Name:</Text>
      <Input
        placeholder='name'
        suffix={
          <Tooltip title='the name of your task, gateway or event'>
            <InfoCircleOutlined style={{ color: 'black' }} />
          </Tooltip>
        }
        value={element.businessObject.name || ''}
        onChange={nameChanged}
      />

      {is(element, 'bpmn:Task') && (
        <>
          <Text className={styles[`label-on-dark-background`]}>Actions: </Text>
          <PropertiesPanelApplicationDropdown
            onApplicationSelection={applicationSelectionUpdated}
            applications={sessionStorage
              .getItem('AvailableApplications')
              .split(',')}
            currentSelection={
              element.businessObject.$attrs['arkRPA:application']
            }
          />
          <PropertiesPanelTaskDropdown
            listOfTasks={tasksForSelectedApplication}
            onTaskSelection={taskSelectionUpdated}
            disabled={disableTaskSelection}
            currentSelection={element.businessObject.$attrs['arkRPA:task']}
          />
        </>
      )}
    </Space>
  </div>
);
export default PropertiesPanelView;
