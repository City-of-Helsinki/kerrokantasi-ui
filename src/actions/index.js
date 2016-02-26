import {createAction} from 'redux-actions';
import api from 'api';
import {alert, notifySuccess, notifyError} from '../utils/notify';
export {login, logout, retrieveUserFromSession} from './user';
export const setLanguage = createAction('setLanguage');

function checkResponseStatus(response) {
  let err;
  if (response.status >= 400) {
    err = new Error("Bad response from server");
    err.response = response;
    throw err;
  }
}

function getResponseJSON(response) {
  checkResponseStatus(response);
  return response.json();
}

function requestErrorHandler(dispatch, fetchAction) {
  return (err) => {
    const callName = fetchAction ? fetchAction.type : "";
    notifyError("API-kutsu " + callName + " epäonnistui: " + err + ". Kokeile pian uudelleen.");
  };
}

export function fetchHearingList(listId, endpoint, params) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchHearingList")({listId});
    dispatch(fetchAction);
    return api.get(getState(), endpoint, params).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveHearingList")({listId, data}));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function fetchHearing(hearingId, previewKey = null) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchHearing")({hearingId});
    dispatch(fetchAction);
    const url = "v1/hearing/" + hearingId + "/";
    const params = previewKey ? {preview: previewKey} : {};
    return api.get(getState(), url, params).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveHearing")({hearingId, data}));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function followHearing(hearingId) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFollowHearing")({hearingId});
    dispatch(fetchAction);
    const url = "v1/hearing/" + hearingId + "/follow";
    return api.post(getState(), url).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveFollowHearing")({hearingId, data}));
      dispatch(fetchHearing(hearingId));
      notifySuccess("Seuraat kuulemista.");
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function fetchSectionComments(hearingId, sectionId) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchSectionComments")({hearingId, sectionId});
    dispatch(fetchAction);
    const url = "v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments";
    return api.get(getState(), url, {}).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveSectionComments")({hearingId, sectionId, data}));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function postHearingComment(hearingId, text) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingComment")({hearingId});
    dispatch(fetchAction);
    const url = ("/v1/hearing/" + hearingId + "/comments/");
    const params = {content: text};
    return api.post(getState(), url, params).then(getResponseJSON).then((data) => {
      dispatch(createAction("postedComment")({hearingId, data}));
      dispatch(fetchHearing(hearingId));
      alert("Kommenttisi on vastaanotettu. Kiitos!");
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function postSectionComment(hearingId, sectionId, text, pluginData = null) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingComment")({hearingId, sectionId});
    dispatch(fetchAction);
    const url = ("/v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments/");
    const params = {content: text, plugin_data: pluginData};
    return api.post(getState(), url, params).then(getResponseJSON).then((data) => {
      dispatch(createAction("postedComment")({hearingId, sectionId, data}));
      dispatch(fetchHearing(hearingId));
      alert("Kommenttisi on vastaanotettu. Kiitos!");
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function postVote(commentId, hearingId, sectionId) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingCommentVote")({hearingId, sectionId});
    dispatch(fetchAction);
    let url = "";
    if (sectionId) {
      url = "/v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments/" + commentId + "/vote";
    } else {
      url = "/v1/hearing/" + hearingId + "/comments/" + commentId + "/vote";
    }
    return api.post(getState(), url).then(getResponseJSON).then((data) => {
      dispatch(createAction("postedCommentVote")({commentId, hearingId, sectionId, data}));
      dispatch(fetchHearing(hearingId));
      notifySuccess("Ääni vastaanotettu. Kiitos!");
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}
