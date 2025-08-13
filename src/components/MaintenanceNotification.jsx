import PropTypes from 'prop-types';
import { NotificationService } from 'react-helsinki-notification-manager';
// eslint-disable-next-line import/no-unresolved
import 'react-helsinki-notification-manager/style.css';

import useNotifications from '../hooks/useNotifications';

const MaintenanceNotification = ({ language }) => {
  const { notifications, visibleTypes } = useNotifications(language);

  return (
    <div className='container maintenance-notification-container'>
      <NotificationService 
        notifications={notifications} 
        visibleTypes={visibleTypes}
        language={language}
      />
    </div>
  );
};

MaintenanceNotification.propTypes = {
  language: PropTypes.string,
};

export default MaintenanceNotification;
