/* eslint-disable react/jsx-closing-tag-location */
import { Notification } from 'hds-react';
import { FormattedMessage } from 'react-intl';
import React from 'react';

const MaintenanceNotification = () => (
  <div className='container maintenance-notification-container'>
    <Notification
      dataTestId='maintenance-notification'
      className='maintenance-notification'
      label={<FormattedMessage id='maintenanceNotificationLabel' />}
    >
      <p><FormattedMessage id='maintenanceNotificationText' /></p>
      <p><FormattedMessage id='maintenanceNotificationText2' /></p>
      <p><FormattedMessage id='maintenanceNotificationText3' /></p>
    </Notification>
  </div>
);

export default MaintenanceNotification;
