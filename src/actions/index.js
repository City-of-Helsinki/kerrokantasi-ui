import {createAction} from 'redux-actions';
import api from 'api';

export const setLanguage = createAction('setLanguage');
export const login = createAction('login');
export const logout = createAction('logout');

export function fetchHearingList(listId, endpoint, params) {
  return (dispatch) => {
    dispatch(createAction("beginFetchHearingList")({listId}));
    return api.get(endpoint, params).then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      response.json().then((data) => {
        dispatch(createAction("receiveHearingList")({listId, data}));
      });
    });
  };
}
