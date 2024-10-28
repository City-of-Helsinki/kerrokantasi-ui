// This module uses `require` and late imports to support isomorphic rendering.
import alertify from 'alertifyjs';

import getMessage from "./getMessage";

export const NOTIFICATION_TYPES = {
  error: 'error',
  success: 'success',
  info: 'info',
};

export function alert(message, title = "Kerrokantasi") {
  if (typeof window !== 'undefined') {
    alertify.alert(title,
      `<div id="alert-dialog" tabindex="0" aria-labelledby="${message}">
        ${message}
      </div>`
    ).set('onfocus', () => {
      document.getElementById("alert-dialog").focus();
    }).setting({ transition: 'slide' });
  }
}

export function createLocalizedAlert(localizationKey) {
  alert(getMessage(localizationKey));
}

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
  }
}

export function createLocalizedNotificationPayload(type, localizationKey) {
  return createNotificationPayload(type, getMessage(localizationKey));
}