import {createAction} from 'redux-actions';
import api from 'api';
import {alert, notifySuccess, notifyError} from '../utils/notify';
import merge from 'lodash/merge';
export {login, logout, retrieveUserFromSession} from './user';
export const setLanguage = createAction('setLanguage');

function checkResponseStatus(response) {
  if (response.status >= 400) {
    const err = new Error("Bad response from server");
    err.response = response;
    throw err;
  }
}

function getResponseJSON(response) {
  checkResponseStatus(response);
  if (response.status === 304) {
    return {status_code: response.status};
  }
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

    // make sure the results won't get paginated
    const paramsWithLimit = merge({limit: 99998}, params);

    return api.get(getState(), endpoint, paramsWithLimit).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveHearingList")({listId, data: data.results}));
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
    return api.get(getState(), url, {include: 'plugin_data'}).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveSectionComments")({hearingId, sectionId, data}));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function postSectionComment(hearingId, sectionId, commentData = {}) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingComment")({hearingId, sectionId});
    dispatch(fetchAction);
    const url = ("/v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments/");
    let params = {
      content: commentData.text ? commentData.text : "",
      plugin_data: commentData.pluginData ? commentData.pluginData : null,
      authorization_code: commentData.authCode ? commentData.authCode : "",
      geojson: commentData.geojson ? commentData.geojson : null,
      label: commentData.label ? commentData.label : null,
      images: commentData.images ? commentData.images : []
    };
    if (commentData.authorName) {
      params = Object.assign(params, {author_name: commentData.authorName});
    }
    return api.post(getState(), url, params).then(getResponseJSON).then((data) => {
      dispatch(createAction("postedComment")({hearingId, sectionId, data}));
      dispatch(fetchHearing(hearingId));
      dispatch(fetchSectionComments(hearingId, sectionId));
      alert("Kommenttisi on vastaanotettu. Kiitos!");
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function postVote(commentId, hearingId, sectionId) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingCommentVote")({hearingId, sectionId});
    dispatch(fetchAction);
    const url = "/v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments/" + commentId + "/vote";
    return api.post(getState(), url).then(getResponseJSON).then((data) => {
      dispatch(createAction("postedCommentVote")({commentId, hearingId, sectionId, data}));
      dispatch(fetchHearing(hearingId));
      dispatch(fetchSectionComments(hearingId, sectionId));
      if (data.status_code === 304) {
        notifyError("Olet jo antanut äänesi tälle kommentille.");
      } else {
        notifySuccess("Ääni vastaanotettu. Kiitos!");
      }
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}
