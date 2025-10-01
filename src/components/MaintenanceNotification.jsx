import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { NotificationService } from '@city-of-helsinki/react-helsinki-notification-manager';
// eslint-disable-next-line import/no-unresolved
import '@city-of-helsinki/react-helsinki-notification-manager/style.css';

import useNotifications from '../hooks/useNotifications';
import LoadSpinner from './LoadSpinner';

const MaintenanceNotification = ({ language }) => {
  const { notifications, visibleTypes } = useNotifications(language);

  return (
    <Suspense fallback={<div className='container maintenance-notification-container'><LoadSpinner /></div>}>
      <div className='container maintenance-notification-container'>
        <NotificationService 
          notifications={notifications} 
          visibleTypes={visibleTypes}
          language={language}
        />
      </div>
    </Suspense>
  );
};

MaintenanceNotification.propTypes = {
  language: PropTypes.string,
};

export default MaintenanceNotification;
