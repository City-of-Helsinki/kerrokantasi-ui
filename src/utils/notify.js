// This module uses `require` and late imports to support isomorphic rendering.
import getMessage from "./getMessage";

export function alert(message, title = "Kerrokantasi") {
  if (typeof window !== 'undefined') {
    require("alertifyjs").alert(title, message).setting({transition: 'slide'});
  }
}

export function notifyError(message) {
  if (typeof window !== 'undefined') {
    require("alertifyjs").notify(message, 'error', 0);
  }
}

export function notifySuccess(message) {
  if (typeof window !== 'undefined') {
    require("alertifyjs").notify(message, 'success', 5);
  }
}

export function localizedAlert(string) {
  return alert(getMessage(string));
}

export function localizedNotifyError(string) {
  return notifyError(getMessage(string));
}

export function localizedNotifySuccess(string) {
  return notifySuccess(getMessage(string));
}
