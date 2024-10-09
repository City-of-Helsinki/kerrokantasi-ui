// This module uses `require` and late imports to support isomorphic rendering.
export const ADD_TOAST = 'ADD_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';

export const addToast = (toast) => ({
  type: ADD_TOAST,
  payload: toast,
});

export const removeToast = (toast) => ({
  type: REMOVE_TOAST,
  payload: toast,
});