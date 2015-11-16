import {createAction} from 'redux-actions';
import api from 'api';
export {login, logout, retrieveUserFromSession} from './user';
export const setLanguage = createAction('setLanguage');

export function fetchHearingList(listId, endpoint, params) {
  return (dispatch, getState) => {
    dispatch(createAction("beginFetchHearingList")({listId}));
    return api.get(getState(), endpoint, params).then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("receiveHearingList")({listId, data}));
    });
  };
}

export function fetchHearing(hearingId) {
  return (dispatch, getState) => {
    dispatch(createAction("beginFetchHearing")({hearingId}));
    const url = "v1/hearing/" + hearingId + "/";
    return api.get(getState(), url).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("receiveHearing")({hearingId, data}));
    });
  };
}

export function followHearing(hearingId) {
  return (dispatch, getState) => {
    dispatch(createAction("beginFollowHearing")({hearingId}));
    const url = "v1/hearing/" + hearingId + "/follow";
    return api.post(getState(), url).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("receiveFollowHearing")({hearingId, data}));
      dispatch(fetchHearing(hearingId));
    });
  };
}

export function fetchScenarioComments(hearingId, scenarioId) {
  return (dispatch, getState) => {
    dispatch(createAction("beginFetchScenarioComments")({hearingId, scenarioId}));
    const url = "v1/hearing/" + hearingId + "/scenarios/" + scenarioId + "/comments";
    return api.get(getState(), url, {}).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("receiveScenarioComments")({hearingId, scenarioId, data}));
    });
  };
}

export function postHearingComment(hearingId, params) {
  return (dispatch, getState) => {
    dispatch(createAction("postingHearingComment")({hearingId}));
    const url = ("/v1/hearing/" + hearingId + "/comments/");
    return api.post(getState(), url, params).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("postedHearingComment")({hearingId, data}));
      dispatch(fetchHearing(hearingId));
    });
  };
}

export function postScenarioComment(hearingId, scenarioId, params) {
  return (dispatch, getState) => {
    dispatch(createAction("postingScenarioComment")({hearingId, scenarioId}));
    const url = ("/v1/hearing/" + hearingId + "/scenarios/" + scenarioId + "/comments/");
    return api.post(getState(), url, params).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("postedScenarioComment")({hearingId, scenarioId, data}));
      dispatch(fetchHearing(hearingId));
    });
  };
}

export function postVote(commentId, hearingId, scenarioId) {
  return (dispatch, getState) => {
    dispatch(createAction("postingCommentVote")({hearingId, scenarioId}));
    let url = "";
    if (scenarioId) {
      url = "/v1/hearing/" + hearingId + "/scenarios/" + scenarioId + "/comments/" + commentId + "/vote";
    } else {
      url = "/v1/hearing/" + hearingId + "/comments/" + commentId + "/vote";
    }
    return api.post(getState(), url).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("postedCommentVote")({commentId, hearingId, scenarioId, data}));
      dispatch(fetchHearing(hearingId));
    });
  };
}
