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

export function fetchHearing(hearingId) {
  return (dispatch) => {
    dispatch(createAction("beginFetchHearing")({hearingId}));
    return api.get("v1/hearing/" + hearingId + "/", {}).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      response.json().then((data) => {
        dispatch(createAction("receiveHearing")({hearingId, data}));
      });
    });
  };
}

export function postHearingComment(hearingId, params) {
  return (dispatch) => {
    dispatch(createAction("postingHearingComment")({hearingId}));
    return api.post(("/v1/hearing/" + hearingId + "/comments/"), null, params).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      response.json().then((data) => {
        dispatch(createAction("postedHearingComment")({hearingId, data}));
        dispatch(fetchHearing(hearingId));
      });
    });
  };
}

export function postScenarioComment(hearingId, scenarioId, params) {
  return (dispatch) => {
    dispatch(createAction("postingScenarioComment")({hearingId, scenarioId}));
    return api.post(("/v1/hearing/" + hearingId + "/scenarios/" + scenarioId + "/comments/"), null, params).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      response.json().then((data) => {
        dispatch(createAction("postedScenarioComment")({hearingId, scenarioId, data}));
        dispatch(fetchHearing(hearingId));
      });
    });
  };
}
