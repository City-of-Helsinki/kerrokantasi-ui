import {createAction} from 'redux-actions';
import api from '../api';

import {notifySuccess, notifyError} from '../utils/notify';
import {requestErrorHandler} from './index';


export const AdminActions = {
  ADD_CONTACT: 'addContact',
  ADD_CONTACT_FAILED: 'addContactFailed',
  ADD_CONTACT_SUCCESS: 'addContactSuccess'
};

function checkResponseStatus(response) {
  if (response.status >= 402) {
    const err = new Error("Bad response from server");
    err.response = response;
    throw err;
  }
  return response;
}


export function addContact(contact) {
  return (dispatch, getState) => {
    const postContactAction = createAction(AdminActions.ADD_CONTACT)({ contact });
    dispatch(postContactAction);
    const url = "/v1/contact/";

    return api.post(getState(), url, contact).then(checkResponseStatus).then((response) => {
      if (response.status === 400) {  // Bad request with error message
        notifyError("Tarkista yhteyshenkilön tiedot.");
        response.json().then((errors) => {
          dispatch(createAction(AdminActions.ADD_CONTACT_FAILED)({errors}));
        });
      } else if (response.status === 401) {  // Unauthorized
        notifyError("Et voi luoda yhteyshenkilöä.");
      } else {
        response.json().then((contactJSON) => {
          dispatch(createAction(AdminActions.ADD_CONTACT_SUCCESS)({contact: contactJSON}));
        });
        notifySuccess("Luonti onnistui");
      }
    }).catch(requestErrorHandler(dispatch, postContactAction));
  };
}
