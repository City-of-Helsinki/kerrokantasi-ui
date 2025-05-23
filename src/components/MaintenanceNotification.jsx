import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NotificationService } from 'react-helsinki-notification-manager';

import { getNotifications } from '../utils/notificationService';

const MaintenanceNotification = (props) => {
  const [notifications, setNotifications] = useState([]);
  const { language } = props
  
  useEffect(() => {
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
