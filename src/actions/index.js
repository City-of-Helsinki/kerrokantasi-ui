import {createAction} from 'redux-actions';
import api from '../api';
import {localizedAlert, localizedNotifySuccess, localizedNotifyError} from '../utils/notify';
import merge from 'lodash/merge';
import parse from 'url-parse';
import Raven from 'raven-js';
import {logout} from './user';

export {login, logout, retrieveUserFromSession} from './user';
export const setLanguage = createAction('setLanguage');

function checkResponseStatus(response) {
  if (response.status >= 400) {
    if (response.status === 401) {
      const err = new Error('tokenError');
      throw err;
    } else {
      const err = new Error("Bad response from server");
      err.response = response;
      throw err;
    }
  }
}

export function changeCurrentlyViewed(dispatch, newViewed) {
  dispatch(createAction('changeCurrentlyViewed')({newViewed}));
}

export function getResponseJSON(response) {
  checkResponseStatus(response);
  if (response.status === 304) {
    return {status_code: response.status};
  }
  return response.json();
}

export function requestErrorHandler(dispatch) {
  return (err) => {
    if (err.message === 'tokenError') {
      localizedNotifyError("sessionExpired");
      dispatch(logout());
    } else {
      Raven.captureException(err);
      localizedNotifyError("APICallFailed");
    }
  };
}

export function fetchInitialHearingList(listId, endpoint, params) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchHearingList")({listId, params});
    dispatch(fetchAction);

    // make sure the results will get paginated
    const paramsWithLimit = merge({limit: 10}, params);

    return api.get(getState(), endpoint, paramsWithLimit).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveHearingList")({listId, data}));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function fetchHearingList(listId, endpoint, params) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchHearingList")({listId, params});
    dispatch(fetchAction);

    // make sure the results won't get paginated
    const paramsWithLimit = merge({limit: 99998}, params);

    return api.get(getState(), endpoint, paramsWithLimit).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveHearingList")({listId, data}));
    }).catch(requestErrorHandler(dispatch));
  };
}


export const fetchMoreHearings = (listId) => {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchHearingList")({listId});
    dispatch(fetchAction);

    const url = parse(getState().hearingLists[listId].next, true);

    return api.get(getState(), 'v1/hearing/', url.query).then(getResponseJSON).then((data) => {
      dispatch(createAction('receiveMoreHearings')({listId, data}));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
};

export function fetchLabels() {
  return (dispatch, getState) => {
    const fetchAction = createAction('beginFetchLabels');
    dispatch(fetchAction);
    return api.getAllFromEndpoint(getState(), '/v1/label/').then((data) => {
      dispatch(createAction('receiveLabels')({ data }));
    }).catch(requestErrorHandler(dispatch));
  };
}

export function fetchHearing(hearingSlug, previewKey = null) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchHearing")({hearingSlug});
    dispatch(fetchAction);
    const url = "v1/hearing/" + hearingSlug + "/";
    const params = previewKey ? {preview: previewKey} : {};
    return api.get(getState(), url, params).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveHearing")({hearingSlug, data}));
    }).catch((err) => {
      dispatch(createAction("receiveHearingError")({hearingSlug}));
      requestErrorHandler(err, dispatch);
    });
    // FIXME: Somehow .catch catches errors also from components' render methods
  };
}

export function followHearing(hearingSlug) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFollowHearing")({hearingSlug});
    dispatch(fetchAction);
    const url = "v1/hearing/" + hearingSlug + "/follow";
    return api.post(getState(), url).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveFollowHearing")({hearingSlug, data}));
      dispatch(fetchHearing(hearingSlug));
      localizedNotifySuccess("followingHearing");
    }).catch(requestErrorHandler(dispatch));
  };
}

export function fetchSectionComments(sectionId, ordering = '-n_votes', cleanFetch = true) {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchSectionComments")({sectionId, ordering, cleanFetch});
    dispatch(fetchAction);
    const url = "v1/comment/";
    const params = {
      section: sectionId,
      include: 'plugin_data',
      limit: 100,
      ...(ordering && {ordering})
    };
    return api.get(getState(), url, params).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveSectionComments")({sectionId, data}));
    }).catch(requestErrorHandler(dispatch));
  };
}

export function fetchMoreSectionComments(sectionId, ordering = '-n_votes', next) {
  const cleanFetch = false;

  return (dispatch, getState) => {
    const fetchAction = createAction('beginFetchSectionComments')({sectionId, ordering, cleanFetch});
    dispatch(fetchAction);
    const url = parse(next, true);
    return api.get(getState(), 'v1/comment/', url.query).then(getResponseJSON).then((data) => {
      dispatch(createAction('receiveSectionComments')({sectionId, data}));
    }).catch(requestErrorHandler(dispatch));
  };
}

export function fetchAllSectionComments(hearingSlug, sectionId, ordering = '-n_votes') {
  const cleanFetch = true;

  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchSectionComments")({sectionId, ordering, cleanFetch});
    dispatch(fetchAction);
    const url = "v1/hearing/" + hearingSlug + "/sections/" + sectionId + "/comments";
    return api.get(getState(), url, {include: 'plugin_data', ordering}).then(getResponseJSON).then((data) => {
      dispatch(createAction("receiveSectionComments")({sectionId, data}));
    }).catch(requestErrorHandler(dispatch));
  };
}

export function postSectionComment(hearingSlug, sectionId, commentData = {}) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingComment")({hearingSlug, sectionId});
    dispatch(fetchAction);
    const url = ("/v1/hearing/" + hearingSlug + "/sections/" + sectionId + "/comments/");
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
    return api.post(getState(), url, params).then(getResponseJSON).then(() => {
      dispatch(createAction("postedComment")({sectionId}));
      // we must update hearing comment count
      dispatch(fetchHearing(hearingSlug));
      localizedAlert("commentReceived");
    }).catch(requestErrorHandler(dispatch));
  };
}

export function editSectionComment(hearingSlug, sectionId, commentId, commentData = {}) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingComment")({hearingSlug, sectionId});
    dispatch(fetchAction);
    const url = ("/v1/hearing/" + hearingSlug + "/sections/" + sectionId + "/comments/" + commentId);
    const params = commentData;

    return api.put(getState(), url, params).then(getResponseJSON).then(() => {
      dispatch(createAction("postedComment")({sectionId}));
      localizedAlert("commentEdited");
    }).catch(requestErrorHandler(dispatch));
  };
}

export function deleteSectionComment(hearingSlug, sectionId, commentId) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingComment")({hearingSlug, sectionId});
    dispatch(fetchAction);
    const url = ("/v1/hearing/" + hearingSlug + "/sections/" + sectionId + "/comments/" + commentId);

    return api.apiDelete(getState(), url).then(() => {
      dispatch(createAction("postedComment")({sectionId}));
      // we must update hearing comment count
      dispatch(fetchHearing(hearingSlug));
      localizedAlert("commentDeleted");
    }).catch(requestErrorHandler(dispatch));
  };
}

export function postVote(commentId, hearingSlug, sectionId) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingCommentVote")({hearingSlug, sectionId});
    dispatch(fetchAction);
    const url = "/v1/hearing/" + hearingSlug + "/sections/" + sectionId + "/comments/" + commentId + "/vote";
    return api.post(getState(), url).then(getResponseJSON).then((data) => {
      if (data.status_code === 304) {
        localizedNotifyError("alreadyVoted");
      } else {
        dispatch(createAction("postedCommentVote")({commentId, sectionId}));
        localizedNotifySuccess("voteReceived");
      }
    }).catch(requestErrorHandler(dispatch));
  };
}
