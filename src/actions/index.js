import {createAction} from 'redux-actions';
import api from '../api';
import {localizedAlert, localizedNotifySuccess, localizedNotifyError} from '../utils/notify';
import merge from 'lodash/merge';
import parse from 'url-parse';
import Raven from 'raven-js';
import { push } from 'react-router-redux';
import { retrieveUserFromSession } from './user';

export {login, logout, retrieveUserFromSession} from './user';
export const setLanguage = createAction('setLanguage');
export const setHeadless = createAction('setHeadless');

// Declaring actions as JSON object for consistency
export const MainActions = {
  BEGIN_FETCH_SUB_COMMENTS: 'beginFetchSubComments',
  SUB_COMMENTS_FETCHED: 'subCommentsFetched',
};

function checkResponseStatus(response) {
  if (response.status >= 400) {
    const err = new Error("Bad response from server");
    err.response = response;
    throw err;
  }
}

export function getResponseJSON(response) {
  checkResponseStatus(response);
  if (response.status === 304) {
    return {status_code: response.status};
  }
  return response.json();
}

export function requestErrorHandler() {
  return (err) => {
    Raven.captureException(err);
    localizedNotifyError(err.message);
    // localizedNotifyError("APICallFailed");
  };
}

export const postCommentErrorHandler = () => {
  return (err) => {
    Raven.captureException(err);
    if (err.response.status === 403) {
      localizedNotifyError("loginToComment");
    } else {
      localizedNotifyError(err.message);
    }
  };
};

export const voteCommentErrorHandler = () => {
  return (err) => {
    Raven.captureException(err);
    if (err.response.status === 403) {
      localizedNotifyError("loginToVoteComment");
    } else {
      localizedNotifyError(err.message);
    }
  };
};

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
    }).catch(requestErrorHandler());
  };
}

export function fetchProjects() {
  return (dispatch, getState) => {
    const fetchAction = createAction('fetchProjects')();
    dispatch(fetchAction);
    return api.get(getState(), 'v1/project').then(getResponseJSON).then(data => {
      dispatch(createAction('receiveProjects')({data}));
    }).catch(() => {
      dispatch(createAction("receiveProjectsError")());
      requestErrorHandler();
    });
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
    }).catch(requestErrorHandler());
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
    }).catch(() => {
      dispatch(createAction("receiveHearingError")({hearingSlug}));
      requestErrorHandler();
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
    }).catch(requestErrorHandler());
  };
}

export function fetchSectionComments(sectionId, ordering = '-n_votes', cleanFetch = true) {
  return async (dispatch, getState) => {
    const fetchAction = createAction("beginFetchSectionComments")({sectionId, ordering, cleanFetch});
    dispatch(fetchAction);
    const url = "v1/comment/";
    const params = {
      section: sectionId,
      include: 'plugin_data',
      limit: 100,
      comment: 'null',
      ...(ordering && {ordering})
    };

    const promises = [
      api.get(getState(), url, { ...params, pinned: false }).then(getResponseJSON),
      api.get(getState(), url, { ...params, pinned: true }).then(getResponseJSON)
    ];

    const [unpinnedResponse, pinnedResponse] = await Promise.all(promises);
    const mergedResults = unpinnedResponse;

    if (pinnedResponse.results.length > 0) {
      mergedResults.count += pinnedResponse.count;
      mergedResults.results = [...pinnedResponse.results, ...mergedResults.results];
    }

    return dispatch(createAction("receiveSectionComments")({ sectionId, data: mergedResults }));
  };
}

/**
 * Get a list of subcomments for a single comment.
 * @param {Number} commentId - is of the parent comment.
 * @param {String} sectionId - id of the section the comment belongs to.
 */
export const getCommentSubComments = (commentId, sectionId, jumpTo) => {
  return (dispatch, getState) => {
    const fetchAction = createAction(MainActions.BEGIN_FETCH_SUB_COMMENTS)({sectionId, commentId});
    dispatch(fetchAction);
    const url = "v1/comment/";
    const params = {
      section: sectionId,
      include: 'plugin_data',
      limit: 100,
      comment: commentId,
      ordering: 'created_at',
    };
    return api.get(getState(), url, params).then(getResponseJSON).then((data) => {
      dispatch(createAction(MainActions.SUB_COMMENTS_FETCHED)({sectionId, commentId, data, jumpTo}));
    }).catch(requestErrorHandler());
  };
};

export function fetchMoreSectionComments(sectionId, ordering = '-n_votes', next) {
  const cleanFetch = false;

  return (dispatch, getState) => {
    const fetchAction = createAction('beginFetchSectionComments')({sectionId, ordering, cleanFetch});
    dispatch(fetchAction);
    const url = parse(next, true);
    return api.get(getState(), 'v1/comment/', url.query).then(getResponseJSON).then((data) => {
      dispatch(createAction('receiveSectionComments')({sectionId, data}));
    }).catch(requestErrorHandler());
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
    }).catch(requestErrorHandler());
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
      images: commentData.images ? commentData.images : [],
      answers: commentData.answers ? commentData.answers : [],
      pinned: commentData.pinned ? commentData.pinned : false,
    };
    if (commentData.authorName) {
      params = Object.assign(params, {author_name: commentData.authorName});
    }
    if (commentData.comment) {
      params = {...params, comment: commentData.comment};
    }

    return api.post(getState(), url, params).then(getResponseJSON).then((data) => {
      if (commentData.comment && typeof commentData.comment !== 'undefined') {
        dispatch(getCommentSubComments(commentData.comment, sectionId, data.id));
      } else {
        dispatch(createAction("postedComment")({sectionId, jumpTo: data.id}));
      }
      // we must update hearing comment count
      dispatch(fetchHearing(hearingSlug, null, commentData.comment));
      // also, update user answered questions
      dispatch(retrieveUserFromSession());
      localizedAlert("commentReceived");
    }).catch(postCommentErrorHandler());
  };
}

export function editSectionComment(hearingSlug, sectionId, commentId, commentData = {}) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingComment")({hearingSlug, sectionId});
    dispatch(fetchAction);
    const url = ("/v1/hearing/" + hearingSlug + "/sections/" + sectionId + "/comments/" + commentId);
    const params = commentData;

    return api.put(getState(), url, params).then(getResponseJSON).then((responseJSON) => {
      dispatch(createAction("editedComment")({sectionId, comment: responseJSON}));
      dispatch(fetchHearing(hearingSlug));
      localizedAlert("commentEdited");
    }).catch(requestErrorHandler());
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
    }).catch(requestErrorHandler());
  };
}

export function postVote(commentId, hearingSlug, sectionId, isReply, parentId) {
  return (dispatch, getState) => {
    const fetchAction = createAction("postingCommentVote")({hearingSlug, sectionId});
    dispatch(fetchAction);
    const url = "/v1/hearing/" + hearingSlug + "/sections/" + sectionId + "/comments/" + commentId + "/vote";
    return api.post(getState(), url).then(getResponseJSON).then((data) => {
      if (data.status_code === 304) {
        localizedNotifyError("alreadyVoted");
      } else {
        dispatch(createAction("postedCommentVote")({commentId, sectionId, isReply, parentId}));
        localizedNotifySuccess("voteReceived");
      }
    }).catch(voteCommentErrorHandler());
  };
}

export function deleteHearingDraft(hearingId, hearingSlug) {
  return (dispatch, getState) => {
    const fetchAction = createAction("deletingHearingDraft")({hearingId, hearingSlug});
    dispatch(fetchAction);
    const url = "/v1/hearing/" + hearingSlug;
    return api.apiDelete(getState(), url).then(getResponseJSON).then(() => {
      dispatch(push('/hearings/list?lang=' + getState().language));
      dispatch(createAction("deletedHearingDraft")({hearingSlug}));
      localizedNotifySuccess("draftDeleted");
    }).catch(
      requestErrorHandler()
    );
  };
}
