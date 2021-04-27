import React, { useState } from 'react';
import { Button, Input, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from '../../ModelerSidebar.module.css';
import {
  parameterPropertyStatus,
  setPropertyForParameter,
} from '../../../../../utils/attributeAndParamUtils';

const { Text } = Typography;

/**
 * @description Renders a parameter input field for a given variable
 * @category Client
 * @component
 */
const PPParameterInput = ({
  onValueChange,
  variableName,
  isRequired,
  // eslint-disable-next-line no-unused-vars
  dataType,
  infoText,
  value,
  robotId,
  selectedActivity,
}) => {
  const [userInputRequired, setUserInputRequired] = useState(
    parameterPropertyStatus(
      robotId,
      selectedActivity,
      variableName,
      'requireUserInput'
    )
  );
  const [parameterValue, setParameterValue] = useState(
    parameterPropertyStatus(robotId, selectedActivity, variableName, 'value')
  );

  /**
   * @description changes the state for "userInputRequired" and also the parameter value 
   * @param {String} parameterName Name of the currently handled parameter
   */
  const changeUserInputRequirement = (parameterName) => {
    setPropertyForParameter(
      selectedActivity,
      parameterName,
      'requireUserInput',
      !userInputRequired
    );
    setUserInputRequired(!userInputRequired);
  };

  /**
   * @description changes the parameter value
   * @param {Object} event from the input field
   * @param {String} parameterName Name of the currently handled parameter
   */
  const changeParameterValue = (event, parameterName) => {
    setPropertyForParameter(
      selectedActivity,
      parameterName,
      'value',
      event.target.value
    );
    setParameterValue(event.target.value);
  };

  /**
   * @description returns the Unlock-Icon
   * @returns the corresponding icon
   */
  const returnLockIcon = (inputParameterName) => (
    <UnlockOutlined onClick={() => changeUserInputRequirement(inputParameterName)} />
  )

  return (
    <>
      <Text className={styles[`label-on-dark-background`]}>{variableName}</Text>
      {isRequired && (
        <Tooltip title='This field is required' className={styles.requiredStar}>
          &nbsp;*
        </Tooltip>
      )}

      {!userInputRequired && (
        <Input
          placeholder='Please type in value'
          defaultValue={value}
          value={userInputRequired ? '' : parameterValue}
          onChange={(event) => changeParameterValue(event, variableName)}
          suffix={
            <Tooltip title={infoText}>
              <InfoCircleOutlined />
            </Tooltip>}
          addonAfter={returnLockIcon(variableName)}
          disabled={userInputRequired}
        />)}

      {userInputRequired && (
        <Button
          style={{ width: '100%' }}
          type='primary'
          className={styles.parameterButton}
          onClick={() => changeUserInputRequirement(variableName)}>
          Parameter will be set at execution <LockOutlined />
        </Button>
      )}
    </>
  );
};

PPParameterInput.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  variableName: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  dataType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  robotId: PropTypes.string.isRequired,
  selectedActivity: PropTypes.string.isRequired,
  infoText: PropTypes.string.isRequired,
};

export default PPParameterInput;
