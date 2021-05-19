import React from 'react';
import { notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import corporateDesign from '../../layout/corporateDesign';

/**
 * @category Frontend
 * @module
 */

/**
 * @description Will first consider if a special icon is requested and otherwise return the corresponding icon for the notification type.
 * @param {String} type One from 'Success', 'Warning' or 'Alert' - defines type (and with it the color scheme) for the notification Box
 * @param {String} icon The icon that will be displayed in the notification. (Must be imported and handled in notificationUtils accordingly!)
 * @param {String} colorName Returns the css selector for the matching notification type
 * @returns The icon component of the notification
 */
// eslint-disable-next-line consistent-return
const getIconForType = (type, icon, colorName) => {
  switch (icon) {
    case 'CloudUploadOutlined':
      return (
        <CloudUploadOutlined
          style={{ color: corporateDesign[`${colorName}Icon`] }}
        />
      );
    default:
      switch (type) {
        case 'Success':
          return (
            <CheckCircleOutlined
              style={{ color: corporateDesign[`${colorName}Icon`] }}
            />
          );
        case 'Warning':
          return (
            <WarningOutlined
              style={{ color: corporateDesign[`${colorName}Icon`] }}
            />
          );
        case 'Error':
          return (
            <CloseCircleOutlined
              style={{ color: corporateDesign[`${colorName}Icon`] }}
            />
          );
        default:
      }
  }
};

/**
 * @description Throws a notification at the upper right edge of the screen, which disappears automatically
 * @param {String} type One from 'Success', 'Warning' or 'Alert' - defines type (and with it the color scheme) for the notification Box
 * @param {String} message The message that is displayed in the notification
 * @param {String} icon The icon that will be displayed in the notification. (Must be imported and handled in notificationUtils accordingly!)
 */
const customNotification = (type, message, icon) => {
  const colorName = `color${type}Notification`;

  notification.open({
    message,
    icon: getIconForType(type, icon, colorName),
    style: {
      backgroundColor: corporateDesign[`${colorName}Background`],
    },
  });
};

export default customNotification;
