import React, { useState } from 'react';
import { Input, Tooltip, Checkbox, Row, Typography, Form, Button } from 'antd';
import { InfoCircleOutlined, LockOutlined, UnlockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import corporateDesign from '../../../../../layout/corporateDesign';
import styles from '../../ModelerSidebar.module.css';
import {
  parameterPropertyStatus,
  setPropertyForParameter,
} from '../../../../../utils/attributeAndParamUtils';

const { Text } = Typography;
const { Search } = Input;

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

  const changeUserInputRequirement = (event, parameterName) => {
    setPropertyForParameter(
      selectedActivity,
      parameterName,
      'requireUserInput',
      !userInputRequired
    );
    setUserInputRequired(!userInputRequired);
    console.log(userInputRequired)
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

  const lockInputButton = () => (
    <LockOutlined onClick={(event) => {
      console.log('OnClick1');
      changeUserInputRequirement(event, variableName)
    }} />
    // <Checkbox onChange={buttonClick} />
    /* <Link onClick={buttonClick} >
      <Text type="primary">
        Disable
    </Text>
    </Link> */

    /*     <Checkbox
          onChange={(event) => changeUserInputRequirement(event, variableName)}
          checked={userInputRequired}
          className={styles[`label-on-dark-background`]}
        >
          User Input required
        </Checkbox> */
  )

  return (
    <>
      <Row>
        <Text className={styles[`label-on-dark-background`]}>{variableName}</Text>
        {isRequired && (
          <Tooltip title='HintText' className={styles.requiredStar}>
            &nbsp;*
          </Tooltip>
        )
        }
      </Row>

      <Input
        placeholder='Please type in value'
        defaultValue={value}
        value={userInputRequired ? '' : parameterValue}
        onChange={(event) => changeParamterValue(event, variableName)}
        onPressEnter={onValueChange}
        suffix={
          <Tooltip title={infoText}>
            <InfoCircleOutlined />
          </Tooltip>}
        addonAfter={lockInputButton()}
        disabled={userInputRequired}
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
  infoText: PropTypes.string.isRequired,
};

export default PPParameterInput;
