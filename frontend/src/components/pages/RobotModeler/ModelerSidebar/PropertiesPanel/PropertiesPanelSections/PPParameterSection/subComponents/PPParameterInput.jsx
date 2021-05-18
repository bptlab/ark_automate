import React, { useState } from 'react';
import { Button, Input, Tooltip, Typography } from 'antd';
import {
  InfoCircleOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from '../../../../ModelerSidebar.module.css';
import {
  setPropertyForParameter,
  parameterPropertyStatus,
} from '../../../../../../../../utils/sessionStorage/localSsotController/parameters';

const { Text } = Typography;

/**
 * @description Renders a parameter input field for a given parameter
 * @category Frontend
 * @component
 */
const PPParameterInput = ({
  parameterName,
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
      parameterName,
      'requireUserInput'
    )
  );
  const [parameterValue, setParameterValue] = useState(
    parameterPropertyStatus(robotId, selectedActivity, parameterName, 'value')
  );

  /**
   * @description changes the state for "userInputRequired" and also the parameter value
   * @param {String} currentParameterName Name of the currently handled parameter
   */
  const changeUserInputRequirement = (currentParameterName) => {
    setParameterValue('');
    setPropertyForParameter(
      selectedActivity,
      parameterName,
      'requireUserInput',
      !userInputRequired
    );
    setPropertyForParameter(
      selectedActivity,
      currentParameterName,
      'value',
      ''
    );
    setUserInputRequired(!userInputRequired);
  };

  /**
   * @description changes the parameter value
   * @param {Object} event from the input field
   * @param {String} currentParameterName Name of the currently handled parameter
   */
  const changeParameterValue = (event, currentParameterName) => {
    setPropertyForParameter(
      selectedActivity,
      currentParameterName,
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
    <UnlockOutlined
      onClick={() => changeUserInputRequirement(inputParameterName)}
    />
  );

  return (
    <>
      <Text className={styles[`label-on-dark-background`]}>
        {parameterName}
      </Text>
      {isRequired && (
        <Tooltip title='This field is required' className={styles.requiredStar}>
          &nbsp;*
        </Tooltip>
      )}

      {!userInputRequired && (
        <Input
          placeholder='Please type in value'
          defaultValue={value}
          value={parameterValue}
          onChange={(event) => changeParameterValue(event, parameterName)}
          suffix={
            <Tooltip title={infoText}>
              <InfoCircleOutlined />
            </Tooltip>
          }
          addonAfter={returnLockIcon(parameterName)}
          disabled={userInputRequired}
        />
      )}

      {userInputRequired && (
        <Button
          style={{ width: '100%' }}
          type='primary'
          className={styles.parameterButton}
          onClick={() => changeUserInputRequirement(parameterName)}
        >
          Parameter will be set at execution <LockOutlined />
        </Button>
      )}
    </>
  );
};

PPParameterInput.propTypes = {
  parameterName: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  dataType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  robotId: PropTypes.string.isRequired,
  selectedActivity: PropTypes.string.isRequired,
  infoText: PropTypes.string.isRequired,
};

export default PPParameterInput;
