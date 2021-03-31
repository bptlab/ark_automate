import React, { useState } from 'react';
import { Input, Tooltip, Checkbox } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import corporateDesign from '../../../../../layout/corporateDesign';
import styles from '../../ModelerSidebar.module.css';
import {
  parameterPropertyStatus,
  setPropertyForParameter,
} from '../../../../../utils/attributeAndParamUtils';

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

  const changeUserInputRequirement = (event, parameterName) => {
    if (event.target.checked) {
      setPropertyForParameter(
        selectedActivity,
        parameterName,
        'requireUserInput',
        true
      );
      setUserInputRequired(true);
    } else {
      setPropertyForParameter(
        selectedActivity,
        parameterName,
        'requireUserInput',
        false
      );
      setUserInputRequired(false);
    }
  };

  const changeParamterValue = (event, parameterName) => {
    setPropertyForParameter(
      selectedActivity,
      parameterName,
      'value',
      event.target.value
    );
    setParameterValue(event.target.value);
  };
  return (
    <>
      <Input
        placeholder={variableName}
        defaultValue={value}
        value={userInputRequired ? '' : parameterValue}
        onChange={(event) => changeParamterValue(event, variableName)}
        onPressEnter={onValueChange}
        suffix={
          isRequired && (
            <Tooltip title='This field is required for the task to work'>
              <InfoCircleOutlined
                style={{ color: corporateDesign.colorBackgroundCta }}
              />
            </Tooltip>
          )
        }
        disabled={userInputRequired}
      />
      <Checkbox
        onChange={(event) => changeUserInputRequirement(event, variableName)}
        checked={userInputRequired}
        className={styles[`label-on-dark-background`]}
      >
        User Input required
      </Checkbox>
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
};

export default PPParameterInput;
