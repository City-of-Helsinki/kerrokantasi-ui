import React from 'react';

export const NotificationService = jest.fn(({ notifications }) => {
  return <div data-testid="mock-notification-service">{notifications.length} notifications</div>;
});

export default { NotificationService };