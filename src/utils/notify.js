import getMessage from './getMessage';

export const NOTIFICATION_TYPES = {
  error: 'error',
  success: 'success',
  info: 'info',
};

function getDefaultMessage(type) {
  switch (type) {
    case 'error':
      return 'Jokin meni pieleen.';
    case 'success':
      return 'Toiminto onnistui.';
    default:
      return 'Ok.';
  }
}

export function createNotificationPayload(type, message) {
  return {
    type,
    message: message || getDefaultMessage(type),
    id: Date.now(),
  };
}

export function createLocalizedNotificationPayload(type, localizationKey) {
  return createNotificationPayload(type, getMessage(localizationKey));
}
