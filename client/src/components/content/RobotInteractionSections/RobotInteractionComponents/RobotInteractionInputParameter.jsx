import React from 'react';
import { Typography, Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import corporateDesign from '../../../../layout/corporateDesign';

const { Text } = Typography;
/**
 * @description Renders a parameter input field for a given variable
 * @category Client
 * @component
 */
const RobotInteractionInputParameter = ({
  variableName,
  // eslint-disable-next-line no-unused-vars
  dataType,
  infoText,
  updateParameterValue,
  parameterId,
}) => (
  <>
    <Text strong>{variableName}</Text>
    <Input
      placeholder={variableName}
      defaultValue=''
      onChange={(event) =>
        updateParameterValue(parameterId, event.target.value)
      }
      suffix={
        <Tooltip title={infoText} placement="topRight" arrowPointAtCenter>
          <InfoCircleOutlined
            style={{ color: corporateDesign.colorBackgroundCta }}
          />
        </Tooltip>
      }
    />
  </>
);

RobotInteractionInputParameter.propTypes = {
  variableName: PropTypes.string.isRequired,
  dataType: PropTypes.string.isRequired,
  infoText: PropTypes.string.isRequired,
  updateParameterValue: PropTypes.func.isRequired,
  parameterId: PropTypes.string.isRequired,
};

export default RobotInteractionInputParameter;
