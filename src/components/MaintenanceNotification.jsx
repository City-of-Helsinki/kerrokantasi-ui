import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { NotificationService } from 'react-helsinki-notification-manager';
// eslint-disable-next-line import/no-unresolved
import 'react-helsinki-notification-manager/style.css';

import { getNotifications } from '../utils/notificationService';

const MaintenanceNotification = (props) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const { language } = props;
  
  const visibleTypeRules = useMemo(() => location.pathname !== '/' ?
    'error' :
    'all', 
  [location.pathname]);
  


  useEffect(() => {
    const loadNotifications = async () => {
      setNotifications(await getNotifications(language));
    }
    if (language) loadNotifications();
  }, [language]);

  const visibleTypes = useMemo(() => {
    if (visibleTypeRules === 'all') {
      return ['error', 'warning', 'info'];
    }
    return [visibleTypeRules];
  }, [visibleTypeRules]);

  return (
    <div className='container maintenance-notification-container'>
      <NotificationService notifications={notifications} visibleTypes={visibleTypes} />
    </div>
  );
};

MaintenanceNotification.propTypes = {
  language: PropTypes.string,
};

export default MaintenanceNotification;
