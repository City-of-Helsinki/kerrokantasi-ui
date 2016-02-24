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

export function fetchHearing(hearingId, previewKey = null) {
  return (dispatch, getState) => {
    dispatch(createAction("beginFetchHearing")({hearingId}));
    const url = "v1/hearing/" + hearingId + "/";
    const params = previewKey ? {preview: previewKey} : {};
    return api.get(getState(), url, params).then((response) => {
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

export function fetchSectionComments(hearingId, sectionId) {
  return (dispatch, getState) => {
    dispatch(createAction("beginFetchSectionComments")({hearingId, sectionId}));
    const url = "v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments";
    return api.get(getState(), url, {}).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("receiveSectionComments")({hearingId, sectionId, data}));
    });
  };
}

export function postHearingComment(hearingId, text) {
  return (dispatch, getState) => {
    dispatch(createAction("postingHearingComment")({hearingId}));
    const url = ("/v1/hearing/" + hearingId + "/comments/");
    const params = {content: text};
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

export function postSectionComment(hearingId, sectionId, text, pluginData = null) {
  return (dispatch, getState) => {
    dispatch(createAction("postingSectionComment")({hearingId, sectionId}));
    const url = ("/v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments/");
    const params = {content: text, plugin_data: pluginData};
    return api.post(getState(), url, params).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("postedSectionComment")({hearingId, sectionId, data}));
      dispatch(fetchHearing(hearingId));
    });
  };
}

export function postVote(commentId, hearingId, sectionId) {
  return (dispatch, getState) => {
    dispatch(createAction("postingCommentVote")({hearingId, sectionId}));
    let url = "";
    if (sectionId) {
      url = "/v1/hearing/" + hearingId + "/sections/" + sectionId + "/comments/" + commentId + "/vote";
    } else {
      url = "/v1/hearing/" + hearingId + "/comments/" + commentId + "/vote";
    }
    return api.post(getState(), url).then((response) => {
      if (response.status >= 400) {
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data) => {
      dispatch(createAction("postedCommentVote")({commentId, hearingId, sectionId, data}));
      dispatch(fetchHearing(hearingId));
    });
  };
}
