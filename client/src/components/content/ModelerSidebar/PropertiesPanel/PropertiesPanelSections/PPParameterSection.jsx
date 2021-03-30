import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Space, Checkbox } from 'antd';
import styles from '../../ModelerSidebar.module.css';
import PPParameterInput from '../PropertiesPanelComponents/PPParameterInput';
import { setRequireUserInput } from '../../../../../utils/attributeAndParamUtils';

const { Text } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Client
 * @component
 */
const PPParameterSection = ({
  selectedActivity,
  variableList,
  onValueChange,
  robotId,
}) => {
  const changeUserInputRequirement = (event, parameterName) => {
    // also clear input field value and update variable in backend
    if (event.target.checked) {
      setRequireUserInput(selectedActivity, parameterName, true);
    } else {
      setRequireUserInput(selectedActivity, parameterName, false);
    }
  };

  return (
    <>
      <Text className={styles[`label-on-dark-background`]}>Parameter:</Text>

      <Space direction='vertical' style={{ width: '100%' }}>
        {variableList.map((singleInput) => (
          <>
            <PPParameterInput
              onValueChange={onValueChange}
              variableName={singleInput.name}
              isRequired={singleInput.isRequired}
              dataType={singleInput.type}
              value={singleInput.value}
              robotId={robotId}
              selectedActivity={selectedActivity}
            />
            <Checkbox
              onChange={(event) =>
                changeUserInputRequirement(event, singleInput.name)
              }
              className={styles[`label-on-dark-background`]}
            >
              User Input required
            </Checkbox>
          </>
        ))}
      </Space>
    </>
  );
};

PPParameterSection.propTypes = {
  selectedActivity: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  variableList: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default PPParameterSection;
