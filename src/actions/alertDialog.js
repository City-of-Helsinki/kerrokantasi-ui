export const SHOW_ALERT_DIALOG = 'SHOW_ALERT_DIALOG';
export const HIDE_ALERT_DIALOG = 'HIDE_ALERT_DIALOG';

/**
 * Opens the alert dialog with a localized message.
 * @param {string} messageId i18n key of the message, so that the dialog
 * renders in the current language.
 */
export const showAlertDialog = (messageId) => ({
  type: SHOW_ALERT_DIALOG,
  payload: { messageId },
});

export const hideAlertDialog = () => ({
  type: HIDE_ALERT_DIALOG,
});
