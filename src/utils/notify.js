// This module uses `require` and late imports to support isomorphic rendering.

export function alert(message, title = "Kerro Kantasi") {
  if (typeof window !== 'undefined') {
    require("alertifyjs").alert(title, message);
  }
}

export function notifyError(message) {
  if (typeof window !== 'undefined') {
    require("alertifyjs").notify(message, 'error', 5);
  }
}

export function notifySuccess(message) {
  if (typeof window !== 'undefined') {
    require("alertifyjs").notify(message, 'success', 5);
  }
}
