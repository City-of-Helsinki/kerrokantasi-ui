// This module uses `require` and late imports to support isomorphic rendering.
import { toast } from 'react-toastify';
import alertify from 'alertifyjs';

import getMessage from "./getMessage";

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

const infoOptions = {
  autoClose: 2000,
  type: toast.TYPE.INFO,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_RIGHT,
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

export function notifyError(message) {
  if (typeof window !== 'undefined') {
    if (message) {
      toast.error(message, errorOptions); // add type: 'success' to options
    } else {
      toast.error('Jokin meni pieleen.', errorOptions); // add type: 'success' to options
    }
  }
}

export function notifySuccess(message) {
  if (typeof window !== 'undefined') {
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
  if (string) {
    toast.error(getMessage(string), errorOptions); // add type: 'success' to options
  } else {
    toast.error('Jokin meni pieleen.', errorOptions); // add type: 'success' to options
  }
}

export function localizedNotifySuccess(string) {
  if (string) {
    toast.success(getMessage(string), successOptions); // add type: 'success' to options
  } else {
    toast.success('Toiminto onnistui.', successOptions); // add type: 'success' to options
  }
}


export function notifyInfo(message) {
  if (typeof window !== 'undefined') {
    if (message) {
      toast.success(message, infoOptions);
    } else {
      toast.success('Ok.', infoOptions);
    }
  }
}
