/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NotificationService } from 'react-notification-service';

import { getNotifications } from '../utils/notificationService';

const MaintenanceNotification = (props) => {
  const [notifications, setNotifications] = useState([]);
  const { language } = props

  useEffect(() => {
    console.debug(language);
    const loadNotifications = async () => {
      setNotifications(await getNotifications(language));
    }
    if (language) loadNotifications();
  }, [language]);
  return (
    <div className='container maintenance-notification-container'>
      <NotificationService notifications={notifications} />
    </div>
  );
};

MaintenanceNotification.propTypes = {
  language: PropTypes.string,
};

export default MaintenanceNotification;
