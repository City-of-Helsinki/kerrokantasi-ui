import {createAction} from 'redux-actions';
import api from '../api';
import {notifySuccess, notifyError} from '../utils/notify';
import moment from 'moment';
import Promise from 'bluebird';
import {push} from 'redux-router';

import {getResponseJSON, requestErrorHandler} from './index';
import {getHearingEditorURL} from '../utils/hearing';


export const EditorActions = {
  SHOW_FORM: 'showHearingForm',
  CLOSE_FORM: 'closeHearingForm',
  SET_LANGUAGES: 'setEditorLanguages',
  INIT_NEW_HEARING: 'initNewHearing',
  CLOSE_HEARING: 'closeHearing',
  EDIT_HEARING: 'changeHearing',
  POST_HEARING: 'savingNewHearing',
  POST_HEARING_SUCCESS: 'savedNewHearing',
  PUBLISH_HEARING: 'publishingHearing',
  SAVE_HEARING: 'savingHearingChange',
  SAVE_HEARING_SUCCESS: 'savedHearingChange',
  SAVE_HEARING_FAILED: 'saveHearingFailed',
  UNPUBLISH_HEARING: 'unPublishingHearing',
  ADD_SECTION: 'addSection',
  EDIT_SECTION: 'changeSection',
  EDIT_SECTION_MAIN_IMAGE: 'changeSectionMainImage',
  REMOVE_SECTION: 'removeSection',
  FETCH_META_DATA: 'beginFetchHearingEditorMetaData',
  RECEIVE_META_DATA: 'receiveHearingEditorMetaData',
  RECEIVE_HEARING: 'editorReceiveHearing',
};

export function receiveHearing(normalizedHearing) {
  return createAction(EditorActions.RECEIVE_HEARING)(normalizedHearing);
}

export function initNewHearing() {
  return createAction(EditorActions.INIT_NEW_HEARING)();
}

function checkResponseStatus(response) {
  if (response.status >= 402) {
    const err = new Error("Bad response from server");
    err.response = response;
    throw err;
  }
  return response;
}


export function startHearingEdit() {
  return (dispatch) => {
    return dispatch(createAction(EditorActions.SHOW_FORM)());
  };
}


export function closeHearingForm() {
  return (dispatch) => {
    return dispatch(createAction(EditorActions.CLOSE_FORM)());
  };
}

/**
 * Fetch meta data required by hearing editor. Such meta data can be for example
 * list of available labels and contact persons.
 * Fetched meta data will be dispatched onwards so that it can be reduced as needed.
 */
export function fetchHearingEditorMetaData() {
  return (dispatch, getState) => {
    const fetchAction = createAction(EditorActions.FETCH_META_DATA)();
    dispatch(fetchAction);
    return Promise.props({
      labels: api.get(getState(), "/v1/label/").then(getResponseJSON),
      contacts: api.get(getState(), "/v1/contact_person/").then(getResponseJSON),
    }).then(({labels, contacts}) => {
      dispatch(createAction(EditorActions.RECEIVE_META_DATA)({
        // Unwrap the DRF responses:
        labels: labels.results,
        contactPersons: contacts.results,
      }));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function changeHearing(field, value) {
  return (dispatch) => {
    return dispatch(createAction(EditorActions.EDIT_HEARING)({field, value}));
  };
}

export function changeSection(sectionID, field, value) {
  return (dispatch) => {
    return dispatch(createAction(EditorActions.EDIT_SECTION)({sectionID, field, value}));
  };
}

export function changeSectionMainImage(sectionID, field, value) {
  return (dispatch) => {
    return dispatch(createAction(EditorActions.EDIT_SECTION_MAIN_IMAGE)({sectionID, field, value}));
  };
}

export function addSection(section) {
  return (dispatch) => {
    return dispatch(createAction(EditorActions.ADD_SECTION)({section}));
  };
}


/*
* Removes section from hearing
* @param {str} sectionID - Is compared to section.id and section.frontID in that order
 */
export function removeSection(sectionID) {
  return (dispatch) => {
    return dispatch(createAction(EditorActions.REMOVE_SECTION)({sectionID}));
  };
}

export function changeHearingEditorLanguages(languages) {
  return (dispatch) =>
    dispatch(createAction(EditorActions.SET_LANGUAGES)({languages}));
}

const cleanHearingSectionIds = (hearing, originalSections) => (
  {
    ...hearing,
    sections: hearing.sections.map((section) => ({
      ...section,
      id: originalSections.find(({id}) => id === section.id) ? section.id : '',
    })),
  }
);


/*
* Save changes made to an existing hearing.
* Passed hearing should represent the new state of the hearing.
* Hearing ID is used to determine which hearing gets updated.
 */
export function saveHearingChanges(hearing) {
  return (dispatch, getState) => {
    const cleanedHearing = cleanHearingSectionIds(hearing, getState().hearing[hearing.slug].data.sections);
    const preSaveAction = createAction(EditorActions.SAVE_HEARING)({cleanedHearing});
    dispatch(preSaveAction);
    const url = "/v1/hearing/" + cleanedHearing.id;
    return api.put(getState(), url, cleanedHearing).then(checkResponseStatus).then((response) => {
      if (response.status === 400) {  // Bad request with error message
        notifyError("Tarkista kuulemisen tiedot.");
        response.json().then((errors) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({errors}));
        });
      } else if (response.status === 401) {  // Unauthorized
        notifyError("Et voi muokata tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({hearing: hearingJSON}));
        });
        notifySuccess("Tallennus onnistui");
      }
    }).then({

    }).catch(requestErrorHandler(dispatch, preSaveAction));
  };
}

export function saveAndPreviewHearingChanges(hearing) {
  return (dispatch, getState) => {
    const cleanedHearing = cleanHearingSectionIds(hearing, getState().hearing[hearing.slug].data.sections);

    const preSaveAction = createAction(EditorActions.SAVE_HEARING, null, () => ({fyi: 'saveAndPreview'}))({cleanedHearing});
    dispatch(preSaveAction);
    const url = "/v1/hearing/" + cleanedHearing.id;
    return api.put(getState(), url, cleanedHearing).then(checkResponseStatus).then((response) => {
      if (response.status === 400) {  // Bad request with error message
        notifyError("Tarkista kuulemisen tiedot.");
        response.json().then((errors) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({errors}));
        });
      } else if (response.status === 401) {  // Unauthorized
        notifyError("Et voi muokata tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({hearing: hearingJSON}));
          dispatch(createAction(EditorActions.CLOSE_FORM)());
          dispatch(push(getHearingEditorURL(hearingJSON)));
        });
        notifySuccess("Tallennus onnistui");
      }
    }).then({

    }).catch(requestErrorHandler(dispatch, preSaveAction));
  };
}


export function saveNewHearing(hearing) {
  // Clean up section IDs assigned by UI before POSTing the hearing
  const cleanedHearing = Object.assign({}, hearing, {
    sections: hearing.sections.reduce((sections, section) =>
      [...sections, Object.assign({}, section, {id: ''})], [])
  });
  return (dispatch, getState) => {
    const preSaveAction = createAction(EditorActions.POST_HEARING)({hearing: cleanedHearing});
    dispatch(preSaveAction);
    const url = "/v1/hearing/";
    return api.post(getState(), url, cleanedHearing).then(checkResponseStatus).then((response) => {
      if (response.status === 400) {  // Bad request with error message
        notifyError("Tarkista kuulemisen tiedot.");
        response.json().then((errors) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({errors}));
        });
      } else if (response.status === 401) {  // Unauthorized
        notifyError("Et voi luoda kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction(EditorActions.POST_HEARING_SUCCESS)({hearing: hearingJSON}));
        });
        notifySuccess("Luonti onnistui");
      }
    }).catch(requestErrorHandler(dispatch, preSaveAction));
  };
}

export function saveAndPreviewNewHearing(hearing) {
  // Clean up section IDs assigned by UI before POSTing the hearing
  const cleanedHearing = Object.assign({}, hearing, {
    sections: hearing.sections.reduce((sections, section) =>
      [...sections, Object.assign({}, section, {id: ''})], [])
  });
  return (dispatch, getState) => {
    const preSaveAction = createAction(EditorActions.POST_HEARING, null, () =>
      ({fyi: 'saveAndPreview'}))({hearing: cleanedHearing});
    dispatch(preSaveAction);
    const url = "/v1/hearing/";
    return api.post(getState(), url, cleanedHearing).then(checkResponseStatus).then((response) => {
      if (response.status === 400) {  // Bad request with error message
        notifyError("Tarkista kuulemisen tiedot.");
        response.json().then((errors) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({errors}));
        });
      } else if (response.status === 401) {  // Unauthorized
        notifyError("Et voi luoda kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction(EditorActions.POST_HEARING_SUCCESS)({hearing: hearingJSON}));
          dispatch(createAction(EditorActions.CLOSE_FORM)());
          dispatch(push(getHearingEditorURL(hearingJSON)));
        });
        notifySuccess("Luonti onnistui");
      }
    }).catch(requestErrorHandler(dispatch, preSaveAction));
  };
}


export function closeHearing(hearing) {
  return (dispatch, getState) => {
    const preCloseAction = createAction(EditorActions.CLOSE_HEARING)({hearing});
    dispatch(preCloseAction);
    const url = "/v1/hearing/" + hearing.id;
    const now = moment().toISOString();
    const changes = {close_at: now};
    return api.patch(getState(), url, changes).then(checkResponseStatus).then((response) => {
      if (response.status === 401) {
        notifyError("Et voi sulkea tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({hearing: hearingJSON}));
        });
        notifySuccess("Kuuleminen suljettiin");
      }
    }).catch(requestErrorHandler(dispatch, preCloseAction));
  };
}


export function publishHearing(hearing) {
  return (dispatch, getState) => {
    const prePublishAction = createAction(EditorActions.PUBLISH_HEARING)({hearing});
    dispatch(prePublishAction);
    const url = "/v1/hearing/" + hearing.id;
    const changes = {published: true};
    return api.patch(getState(), url, changes).then(checkResponseStatus).then((response) => {
      if (response.status === 401) {
        notifyError("Et voi julkaista tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({hearing: hearingJSON}));
        });
        notifySuccess("Kuuleminen julkaistiin");
      }
    }).catch(requestErrorHandler(dispatch, prePublishAction));
  };
}


export function unPublishHearing(hearing) {
  return (dispatch, getState) => {
    const preUnPublishAction = createAction(EditorActions.UNPUBLISH_HEARING)({hearing});
    dispatch(preUnPublishAction);
    const url = "/v1/hearing/" + hearing.id;
    return api.patch(getState(), url, {published: false}).then(checkResponseStatus).then((response) => {
      if (response.status === 401) {
        notifyError("Et voi muokata tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({hearing: hearingJSON}));
        });
        notifySuccess("Muutos tallennettu");
      }
    }).catch(requestErrorHandler(dispatch, preUnPublishAction));
  };
}
