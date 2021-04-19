import React from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CloudUploadOutlined, WarningOutlined } from '@ant-design/icons';
import corporateDesign from '../layout/corporateDesign';

// eslint-disable-next-line consistent-return
const getIconForType = (type, icon, colorName) => {
    switch (icon) {
        case 'CloudUploadOutlined':
            return <CloudUploadOutlined style={{ color: corporateDesign[`${colorName}Icon`] }} />
        default:
            switch (type) {
                case 'Success':
                    return <CheckCircleOutlined style={{ color: corporateDesign[`${colorName}Icon`] }} />
                case 'Warning':
                    return <WarningOutlined style={{ color: corporateDesign[`${colorName}Icon`] }} />
                case 'Error':
                    return <CloseCircleOutlined style={{ color: corporateDesign[`${colorName}Icon`] }} />
                default:
            }
    }
}

const customNotification = (type, message, icon) => {
    const colorName = `color${type}Notification`

    notification.open({
        message,
        icon: (
            getIconForType(type, icon, colorName)
        ),
        style: {
            backgroundColor: corporateDesign[`${colorName}Background`],
        },
    });
};

export default customNotification;
