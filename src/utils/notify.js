// This module uses `require` and late imports to support isomorphic rendering.
import getMessage from "./getMessage";
import {toast} from 'react-toastify';

const successOptions = {
  autoClose: 6000,
  type: toast.TYPE.SUCCESS,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_RIGHT,
  pauseOnHover: true,
};

const errorOptions = {
  autoClose: false,
  type: toast.TYPE.ERROR,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_RIGHT,
};

export function alert(message, title = "Kerrokantasi") {
  if (typeof window !== 'undefined') {
    require("alertifyjs").alert(title, `<div id="alert-dialog" tabindex="0" aria-labelledby="${message}">${message}</div>`).set('onfocus', function(){
      document.getElementById("alert-dialog").focus();
    }).setting({transition: 'slide'});
  }
}

export function notifyError(message) {
  if (typeof window !== 'undefined') {
    // require("alertifyjs").notify(message, 'error', 0);
    if (message) {
      toast.error(message, errorOptions); // add type: 'success' to options
    } else {
      toast.error('Jokin meni pieleen.', errorOptions); // add type: 'success' to options
    }
  }
}

export function notifySuccess(message) {
  if (typeof window !== 'undefined') {
    // require("alertifyjs").notify(message, 'success', 5);
    if (message) {
      toast.success(message, successOptions); // add type: 'success' to options
    } else {
      toast.success('Toiminto onnistui.', successOptions); // add type: 'success' to options
    }
  }
}

export function localizedAlert(string) {
  return alert(getMessage(string));
}

export function localizedNotifyError(string) {
  // return notifyError(getMessage(string));
  if (string) {
    toast.error(getMessage(string), errorOptions); // add type: 'success' to options
  } else {
    toast.error('Jokin meni pieleen.', errorOptions); // add type: 'success' to options
  }
}

export function localizedNotifySuccess(string) {
  // notifySuccess(getMessage(string));
  if (string) {
    toast.success(getMessage(string), successOptions); // add type: 'success' to options
  } else {
    toast.success('Toiminto onnistui.', successOptions); // add type: 'success' to options
  }
}
