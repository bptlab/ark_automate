import React, { useEffect, useState } from 'react';
import { Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import corporateDesign from '../../../../../layout/corporateDesign';
import { getParameterObject } from '../../../../../utils/attributeAndParamUtils';

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
  /**
   * @description Will retrieve the local parameter storage and return the current value of the userInpitRequired property
   * @param {string} robotId id of the selected robot
   * @param {string} activityId id of the selected activity
   */
  const requireUserInputStatus = (robotId, activityId, parameterName) => {
    const paramObj = getParameterObject(robotId, activityId);

    const rpaParameters = paramObj.rpaParameters.filter(
      (element) => element.name === parameterName
    );
    console.log('rpaParameters[0]', rpaParameters[0]);
    if (rpaParameters[0]) {
      console.log(
        'rpaParameters[0].requireUserInput',
        rpaParameters[0].requireUserInput
      );
      return rpaParameters[0].requireUserInput;
    }
    return false;
  };

  const [disabled, setDisabled] = useState(
    requireUserInputStatus(robotId, selectedActivity, variableName)
  );

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    setDisabled(
      requireUserInputStatus(robotId, selectedActivity, variableName)
    );
  }, []);
  return (
    <>
      <Input
        placeholder={variableName}
        defaultValue={value}
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
        disabled={disabled}
      />
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
