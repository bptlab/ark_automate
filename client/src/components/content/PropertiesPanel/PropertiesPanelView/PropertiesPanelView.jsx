import { is } from 'bpmn-js/lib/util/ModelUtil';
import React from 'react';
import PropertiesPanelApplicationDropdown from '../PropertiesPanelApplicationDropdown/PropertiesPanelApplicationDropdown';
import PropertiesPanelTaskDropdown from '../PropertiesPanelTaskDropdown/PropertiesPanelTaskDropdown';
import { Input, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './PropertiesPanelView.module.css';
import '../PropertiesPanel.css';

const { Text } = Typography;

/**
 * @description Shows PropertiesPanel for one selected BPMN-Element.
 * @category Client
 * @component
 */
const PropertiesPanelView = (props) => {
  return (
    <div className='element-properties' key={props.element.id}>
      <fieldset>
        <Text className={`label-on-dark-background ${styles.text}`}>
          {is(props.element, 'bpmn:Task')
            ? 'Activity'
            : is(props.element, 'bpmn:Event')
            ? 'Event'
            : is(props.element, 'bpmn:Gateway')
            ? 'Gateway'
            : ''}
        </Text>
      </fieldset>

      <fieldset>
        <Text className='label-on-dark-background'>ID: </Text>
        <Text className='label-on-dark-background'>{props.element.id}</Text>
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
          value={props.element.businessObject.name || ''}
          onChange={props.nameChanged}
        />
      </fieldset>

      <fieldset>
        {is(props.element, 'bpmn:Task') && (
          <>
            <Text className='label-on-dark-background'>Actions: </Text>
            <br />
            <PropertiesPanelApplicationDropdown
              onApplicationSelection={props.applicationSelectionUpdated}
              applications={sessionStorage
                .getItem('AvailableApplications')
                .split(',')}
              currentSelection={
                props.element.businessObject['$attrs']['arkRPA:application']
              }
            />
            <br />
            <PropertiesPanelTaskDropdown
              listOfTasks={props.tasksForSelectedApplication}
              onTaskSelection={props.taskSelectionUpdated}
              disabled={props.disableTaskSelection}
              currentSelection={
                props.element.businessObject['$attrs']['arkRPA:task']
              }
            />
          </>
        )}
      </fieldset>
    </div>
  );
};
export default PropertiesPanelView;
