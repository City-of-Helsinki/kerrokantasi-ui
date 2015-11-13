import {createAction} from 'redux-actions';
import api from 'api';
export {login, logout, retrieveUserFromSession} from './user';
export const setLanguage = createAction('setLanguage');

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

export function followHearing(hearingId) {
  return (dispatch) => {
    dispatch(createAction("beginFollowHearing")({hearingId}));
    return api.post("v1/hearing/" + hearingId + "/follow").then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      response.json().then((data) => {
        dispatch(createAction("receiveFollowHearing")({hearingId, data}));
        dispatch(fetchHearing(hearingId));
      });
    });
  };
}

export function fetchScenarioComments(hearingId, scenarioId) {
  return (dispatch) => {
    dispatch(createAction("beginFetchScenarioComments")({hearingId, scenarioId}));
    return api.get("v1/hearing/" + hearingId + "/scenarios/" + scenarioId + "/comments", {}).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      response.json().then((data) => {
        dispatch(createAction("receiveScenarioComments")({hearingId, scenarioId, data}));
      });
    });
  };
}

export function postHearingComment(hearingId, params) {
  return (dispatch) => {
    dispatch(createAction("postingHearingComment")({hearingId}));
    return api.post(("/v1/hearing/" + hearingId + "/comments/"), params).then((response) => {
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

export function postVote(commentId, hearingId, scenarioId) {
  return (dispatch) => {
    dispatch(createAction("postingCommentVote")({hearingId, scenarioId}));
    let url = "";
    if (scenarioId) {
      url = "/v1/hearing/" + hearingId + "/scenarios/" + scenarioId + "/comments/" + commentId + "/votes";
    } else {
      url = "/v1/hearing/" + hearingId + "/comments/" + commentId + "/votes";
    }
    return api.post(url).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      response.json().then((data) => {
        dispatch(createAction("postedCommentVote")({commentId, hearingId, scenarioId, data}));
        dispatch(fetchHearing(hearingId));
      });
    });
  };
}
