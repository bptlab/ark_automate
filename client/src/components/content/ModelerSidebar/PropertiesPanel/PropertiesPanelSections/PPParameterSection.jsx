import React from 'react';
import PropTypes from 'prop-types'
import { Typography, Space } from 'antd';
import styles from '../../ModelerSidebar.module.css';
import PPParameterInput from '../PropertiesPanelComponents/PPParameterInput';

const { Text } = Typography;

/**
 * @description Renders the name input field with the corresponding label.
 * @category Client
 * @component
 */
const PPParameterSection = ({ onValueChange, variableList }) => (
    <>
        <Text className={styles[`label-on-dark-background`]}>Parameter:</Text>

        <Space direction='vertical' style={{ width: '100%' }}>
            {variableList.map((singleInput) => (
                <PPParameterInput
                    onValueChange={onValueChange}
                    variableName={singleInput.name}
                    isRequired={singleInput.isRequired}
                    dataType={singleInput.type}
                    value={singleInput.name}
                />
            ))}
        </Space>
    </>

);

PPParameterSection.propTypes = {
    onValueChange: PropTypes.func.isRequired,
    variableList: PropTypes.arrayOf(PropTypes.shape).isRequired
};

export default PPParameterSection;
