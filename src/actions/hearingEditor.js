import { createAction } from 'redux-actions';
import moment from 'moment';
import { omit } from 'lodash';
import { push } from 'react-router-redux';

import { notifySuccess, notifyError, localizedNotifyError } from '../utils/notify';
import { patch, put, post, apiDelete, getAllFromEndpoint } from '../api';
import { requestErrorHandler } from './index';
import { getHearingURL, initNewHearing as getHearingSkeleton } from '../utils/hearing';
import {
  fillFrontIdsAndNormalizeHearing,
  filterFrontIdsFromAttributes,
  filterTitleAndContentByLanguage,
  cleanHearing,
} from '../utils/hearingEditor';

export const EditorActions = {
  ACTIVE_PHASE: 'activePhase',
  ADD_ATTACHMENT: 'addAttachment',
  ADD_CONTACT_FAILED: 'addContactFailed',
  ADD_CONTACT_SUCCESS: 'addContactSuccess',
  ADD_CONTACT: 'addContact',
  ADD_LABEL_FAILED: 'addLabelFailed',
  ADD_LABEL_SUCCESS: 'addLabelSuccess',
  ADD_LABEL: 'addLabel',
  ADD_OPTION: 'addOption',
  DELETE_ATTACHMENT: 'deleteAttachment',
  DELETE_PHASE: 'deletePhase',
  DELETE_EXISTING_QUESTION: 'deleteExistingQuestion',
  ADD_MAP_MARKER: 'addMapMarker',
  ADD_MAP_MARKER_TO_COLLECTION: 'addMoreMapMarkers',
  ADD_PHASE: 'addPhase',
  ADD_SECTION_ATTACHMENT: 'addSectionAttachment',
  ADD_SECTION: 'addSection',
  CHANGE_PROJECT_NAME: 'changeProjectName',
  CHANGE_PROJECT: 'changeProject',
  CLEAR_QUESTIONS: 'clearQuestions',
  CLOSE_FORM: 'closeHearingForm',
  CLOSE_HEARING: 'closeHearing',
  CREATE_MAP_MARKER: 'createMapMarker',
  DELETE_LAST_OPTION: 'deleteLastOption',
  DELETE_TEMP_QUESTION: 'deleteTemporaryQuestion',
  EDIT_HEARING: 'changeHearing',
  EDIT_PHASE: 'changePhase',
  EDIT_QUESTION: 'editQuestion',
  EDIT_SECTION_ATTACHMENT: 'editSecionAttachment',
  EDIT_SECTION_MAIN_IMAGE: 'changeSectionMainImage',
  EDIT_SECTION: 'changeSection',
  ERROR_META_DATA: 'errorHearingEditorMetaData',
  FETCH_META_DATA: 'beginFetchHearingEditorMetaData',
  FETCH_CONTACT_PERSONS: 'beginFetchHearingEditorContactPersons',
  INIT_MULTIPLECHOICE_QUESTION: 'initMultipleChoiceQuestion',
  INIT_NEW_HEARING: 'initNewHearing',
  INIT_SINGLECHOICE_QUESTION: 'initSingleChoiceQuestion',
  ORDER_ATTACHMENTS: 'orderAttachments',
  POST_HEARING_SUCCESS: 'savedNewHearing',
  POST_HEARING: 'savingNewHearing',
  PUBLISH_HEARING: 'publishingHearing',
  RECEIVE_HEARING: 'editorReceiveHearing',
  RECEIVE_META_DATA: 'receiveHearingEditorMetaData',
  RECEIVE_CONTACT_PERSONS: 'receiveHearingEditorContactPersons',
  REMOVE_SECTION: 'removeSection',
  SAVE_HEARING_FAILED: 'saveHearingFailed',
  SAVE_HEARING_SUCCESS: 'savedHearingChange',
  SAVE_HEARING: 'savingHearingChange',
  SECTION_MOVE_DOWN: 'sectionMoveDown',
  SECTION_MOVE_UP: 'sectionMoveUp',
  SET_LANGUAGES: 'setEditorLanguages',
  SHOW_FORM: 'showHearingForm',
  UNPUBLISH_HEARING: 'unPublishingHearing',
  UPDATE_HEARING_AFTER_SAVE: 'updateHearingAfterSave',
  UPDATE_PROJECT_LANGUAGE: 'updateProjectLanguage',
};

function checkResponseStatus(response) {
  if (response.status >= 402) {
    const err = new Error('Bad response from server');
    err.response = response;
    throw err;
  }
  return response;
}

const HEARING_CREATED_MESSAGE = 'Luonti onnistui';
const HEARING_CHECK_HEARING_INFORMATION_MESSAGE = 'Tarkista kuulemisen tiedot.';
const HEARING_CANT_MODIFY = 'Et voi muokata tätä kuulemista.';

export function startHearingEdit() {
  return dispatch => dispatch(createAction(EditorActions.SHOW_FORM)());
}

export function closeHearingForm() {
  return dispatch => dispatch(createAction(EditorActions.CLOSE_FORM)());
}

export function sectionMoveUp(sectionId) {
  return dispatch => dispatch(createAction(EditorActions.SECTION_MOVE_UP)(sectionId));
}

export function sectionMoveDown(sectionId) {
  return dispatch => dispatch(createAction(EditorActions.SECTION_MOVE_DOWN)(sectionId));
}


/**
 * When editing a sections attachment.
 */
export const editSectionAttachment = (sectionId, attachment) => (dispatch, getState) => {
  const url = `/v1/file/${attachment.id}`;
  return put(getState(), url, attachment)
    .then(checkResponseStatus)
    .then(() => dispatch(createAction(EditorActions.EDIT_SECTION_ATTACHMENT)({ sectionId, attachment })));
};

/**
 * For changing order, two requests have to be made.
 * One file is incremented whilst the other decrementd.
 */
export const editSectionAttachmentOrder = (sectionId, attachments) => (dispatch, getState) => {
  const promises = attachments.map((attachment) => {
    const url = `/v1/file/${attachment.id}`;
    return put(getState(), url, attachment);
  });

  return Promise.all(promises)
    .then(() => dispatch(createAction(EditorActions.ORDER_ATTACHMENTS)({ sectionId, attachments })));
};

/**
 * Delete an attached item.
 * @param {String} sectionId - id of the section the attachment belongs to.
 * @param {Object} attachment - attachment in a section or independant of.
 * @reuturns Promise.
 */
export const deleteSectionAttachment = (sectionId, attachment) => (dispatch, getState) => {
  const url = `/v1/file/${attachment.id}`;
  return apiDelete(getState(), url, attachment)
    .then(checkResponseStatus)
    .then(() => dispatch(createAction(EditorActions.DELETE_ATTACHMENT)({ sectionId, attachment })));
};

export function changeProject(projectId, projectLists) {
  return createAction(EditorActions.CHANGE_PROJECT)(projectId, projectLists);
}

export function updateProjectLanguage(languages) {
  return createAction(EditorActions.UPDATE_PROJECT_LANGUAGE)({ languages });
}

export function changeProjectName(fieldname, value) {
  return createAction(EditorActions.CHANGE_PROJECT_NAME)({ fieldname, value });
}

export function deletePhase(phaseId) {
  return createAction(EditorActions.DELETE_PHASE)({ phaseId });
}

export function activePhase(phaseId) {
  return createAction(EditorActions.ACTIVE_PHASE)({ phaseId });
}

export function changePhase(phaseId, fieldName, language, value) {
  return createAction(EditorActions.EDIT_PHASE)({
    phaseId,
    fieldName,
    language,
    value
  });
}

export function addPhase() {
  return createAction(EditorActions.ADD_PHASE)();
}

export function receiveHearing(normalizedHearing) {
  return createAction(EditorActions.RECEIVE_HEARING)(normalizedHearing);
}

export function initNewHearing() {
  return createAction(EditorActions.INIT_NEW_HEARING)(fillFrontIdsAndNormalizeHearing(getHearingSkeleton()));
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
    return Promise.all([
      /* labels */ getAllFromEndpoint(getState(), '/v1/label/'),
      /* organizations */ getAllFromEndpoint(getState(), '/v1/organization/'),
    ])
      .then(([labels, organizations]) => {
        dispatch(
          createAction(EditorActions.RECEIVE_META_DATA)({
            // Unwrap the DRF responses:
            labels,
            organizations,
          }),
        );
      })
      .catch(err => {
        dispatch(createAction(EditorActions.ERROR_META_DATA)({ err }));
        return err;
      })
      .then(err => {
        if (err) {
          requestErrorHandler(dispatch, fetchAction)(err instanceof Error ? err : JSON.stringify(err));
        }
      });
  };
}

export function fetchHearingEditorContactPersons() {
  return (dispatch, getState) => {
    const fetchAction = createAction(EditorActions.FETCH_CONTACT_PERSONS)();
    dispatch(fetchAction);
    return Promise.all([
    /* contacts */ getAllFromEndpoint(getState(), '/v1/contact_person/'),
    ])
      .then(([contacts]) => {
        dispatch(
          createAction(EditorActions.RECEIVE_CONTACT_PERSONS)({
            // Unwrap the DRF responses:
            contactPersons: contacts,
          }),
        );
      })
      .catch(err => {
        dispatch(createAction(EditorActions.ERROR_META_DATA)({ err }));
        return err;
      })
      .then(err => {
        if (err) {
          requestErrorHandler(dispatch, fetchAction)(err instanceof Error ? err : JSON.stringify(err));
        }
      });
  };
}

export function changeHearing(field, value) {
  return dispatch => dispatch(createAction(EditorActions.EDIT_HEARING)({ field, value }));
}

export function addContact(contact, selectedContacts) {
  return (dispatch, getState) => {
    const postContactAction = createAction(EditorActions.ADD_CONTACT)();
    dispatch(postContactAction);
    const url = '/v1/contact_person/';
    return post(getState(), url, contact)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          notifyError('Tarkista yhteyshenkilön tiedot.');
          response.json().then(errors => {
            dispatch(createAction(EditorActions.ADD_CONTACT_FAILED)({ errors }));
          });
        } else if (response.status === 401) {
          // Unauthorized
          notifyError('Et voi luoda yhteyshenkilöä.');
        } else {
          response.json().then(contactJSON => {
            selectedContacts.push(contactJSON.id);
            dispatch(createAction(EditorActions.ADD_CONTACT_SUCCESS)({ contact: contactJSON }));
            dispatch(changeHearing('contact_persons', selectedContacts));
          });
          notifySuccess(HEARING_CREATED_MESSAGE);
        }
      })
      .then(() => dispatch(fetchHearingEditorContactPersons()))
      .catch(requestErrorHandler(dispatch, postContactAction));
  };
}

export function saveContact(contact) {
  return (dispatch, getState) => {
    const url = `/v1/contact_person/${contact.id}/`;
    const contactInfo = omit(contact, ['id']);
    return put(getState(), url, contactInfo)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          notifyError('Sinulla ei ole oikeutta muokata yhteyshenkilöä.');
        } else if (response.status === 401) {
          // Unauthorized
          notifyError('Et voi luoda yhteyshenkilöä.');
        } else {
          notifySuccess('Muokkaus onnistui');
        }
      })
      .then(() => dispatch(fetchHearingEditorContactPersons()))
      .catch(requestErrorHandler());
  };
}

export function addLabel(label, selectedLabels) {
  return (dispatch, getState) => {
    const postLabelAction = createAction(EditorActions.ADD_LABEL)();
    dispatch(postLabelAction);
    const url = '/v1/label/';
    return post(getState(), url, label)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          notifyError('Tarkista asiasanan tiedot.');
          response.json().then(errors => {
            dispatch(createAction(EditorActions.ADD_LABEL_FAILED)({ errors }));
          });
        } else if (response.status === 401) {
          // Unauthorized
          notifyError('Et voi luoda asiasanaa.');
        } else {
          response.json().then(labelJSON => {
            selectedLabels.push(labelJSON.id);
            dispatch(createAction(EditorActions.ADD_LABEL_SUCCESS)({ label: labelJSON }));
            dispatch(changeHearing('labels', selectedLabels));
          });
          notifySuccess(HEARING_CREATED_MESSAGE);
        }
      })
      .then(() => dispatch(fetchHearingEditorMetaData()))
      .catch(requestErrorHandler(dispatch, postLabelAction));
  };
}

export function changeSection(sectionID, field, value) {
  return dispatch => dispatch(createAction(EditorActions.EDIT_SECTION)({ sectionID, field, value }));
}

export function changeSectionMainImage(sectionID, field, value) {
  return dispatch => dispatch(createAction(EditorActions.EDIT_SECTION_MAIN_IMAGE)({ sectionID, field, value }));
}

export function addSection(section) {
  return dispatch => dispatch(createAction(EditorActions.ADD_SECTION)({ section }));
}

export function createMapMarker(value) {
  return dispatch => dispatch(createAction(EditorActions.CREATE_MAP_MARKER)({ value }));
}

export function addMapMarker(value) {
  return dispatch => dispatch(createAction(EditorActions.ADD_MAP_MARKER)({ value }));
}

export function addMapMarkerToCollection(value) {
  return dispatch => dispatch(createAction(EditorActions.ADD_MAP_MARKER_TO_COLLECTION)({ value }));
}

export function initSingleChoiceQuestion(sectionId) {
  return dispatch => dispatch(createAction(EditorActions.INIT_SINGLECHOICE_QUESTION)({ sectionId }));
}

export function initMultipleChoiceQuestion(sectionId) {
  return dispatch => dispatch(createAction(EditorActions.INIT_MULTIPLECHOICE_QUESTION)({ sectionId }));
}

export function clearQuestions(sectionId) {
  return dispatch => dispatch(createAction(EditorActions.CLEAR_QUESTIONS)({ sectionId }));
}

export const addOption = (sectionId, questionId) => dispatch => dispatch(createAction(EditorActions.ADD_OPTION)({ sectionId, questionId }));

export const editQuestion = (fieldType, sectionId, questionId, optionKey, value) => dispatch => dispatch(createAction(EditorActions.EDIT_QUESTION)({ fieldType, sectionId, questionId, value, optionKey }));

export const deleteTemporaryQuestion = (sectionId, questionFrontId) => createAction(EditorActions.DELETE_TEMP_QUESTION)({ sectionId, questionFrontId });

export const deleteLastOption = (sectionId, questionId, optionKey) => dispatch => dispatch(createAction(EditorActions.DELETE_LAST_OPTION)({ sectionId, questionId, optionKey }));

export const deleteExistingQuestion = (sectionId, questionId) => dispatch => dispatch(createAction(EditorActions.DELETE_EXISTING_QUESTION)({ sectionId, questionId }));

/*
* Removes section from hearing
* @param {str} sectionID - Is compared to section.id and section.frontId in that order
 */
export function removeSection(sectionID) {
  return dispatch => dispatch(createAction(EditorActions.REMOVE_SECTION)({ sectionID }));
}

export function changeHearingEditorLanguages(languages) {
  return dispatch => dispatch(createAction(EditorActions.SET_LANGUAGES)({ languages }));
}

/*
* Save changes made to an existing hearing.
* Passed hearing should represent the new state of the hearing.
* Hearing ID is used to determine which hearing gets updated.
 */
export function saveHearingChanges(hearing) {
  return (dispatch, getState) => {
    const cleanedHearing = filterTitleAndContentByLanguage(
      filterFrontIdsFromAttributes(hearing), getState().hearingEditor.languages
    );

    const preSaveAction = createAction(EditorActions.SAVE_HEARING)({ cleanedHearing });
    dispatch(preSaveAction);
    const url = `/v1/hearing/${cleanedHearing.id}`;
    return put(getState(), url, cleanedHearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          notifyError(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
        } else if (response.status === 401) {
          // Unauthorized
          notifyError(HEARING_CANT_MODIFY);
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
            dispatch(closeHearingForm());
            dispatch(push(`/${hearingJSON.slug}?lang=${getState().language}`));
            if (hearing.slug !== hearingJSON.slug) {
              localizedNotifyError("slugInUse");
            }
          });
          notifySuccess('Tallennus onnistui');
        }
      })
      .then({})
      .catch(requestErrorHandler(dispatch, preSaveAction));
  };
}

/**
 * Method that will be used to upload the file to the server.
 * @param {Document} section - attachments to be uploaded.
 */
export function addSectionAttachment(section, file, title, isNew) {
  // This method is a little different to exisitn methods as it uploads as soon as user selects file.
  return (dispatch, getState) => {
    const url = '/v1/file';
    let data = { file, title };
    if (!isNew) {
      data = { ...data, section };
    }
    return post(getState(), url, data)
      .then(checkResponseStatus)
      .then((response) => {
        if (response.status === 400 && !isNew) {
          localizedNotifyError('errorSaveBeforeAttachment');
        } else {
          response.json().then((attachment) => dispatch(createAction(EditorActions.ADD_ATTACHMENT)({ sectionId: section, attachment })));
        }
      });
  };
}

export function saveAndPreviewHearingChanges(hearing) {
  return (dispatch, getState) => {
    const cleanedHearing = filterTitleAndContentByLanguage(
      filterFrontIdsFromAttributes(hearing), getState().hearingEditor.languages
    );
    const preSaveAction = createAction(EditorActions.SAVE_HEARING, null, () => ({ fyi: 'saveAndPreview' }))({
      cleanedHearing,
    });
    dispatch(preSaveAction);
    const url = `/v1/hearing/${cleanedHearing.id}`;
    return put(getState(), url, cleanedHearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          notifyError(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
        } else if (response.status === 401) {
          // Unauthorized
          notifyError(HEARING_CANT_MODIFY);
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
            dispatch(createAction(EditorActions.CLOSE_FORM)());
            dispatch(push(getHearingURL(hearingJSON)));
          });
          notifySuccess('Tallennus onnistui');
        }
      })
      .then({})
      .catch(requestErrorHandler(dispatch, preSaveAction));
  };
}

export function saveNewHearing(hearing) {
  return (dispatch, getState) => {
    // Clean up section IDs assigned by UI before POSTing the hearing
    const cleanedHearing = filterTitleAndContentByLanguage(
      filterFrontIdsFromAttributes(hearing), getState().hearingEditor.languages
    );
    const preSaveAction = createAction(EditorActions.POST_HEARING)({ hearing: cleanedHearing });
    dispatch(preSaveAction);
    const url = '/v1/hearing/';
    return post(getState(), url, cleanedHearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          notifyError(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
        } else if (response.status === 401) {
          // Unauthorized
          notifyError('Et voi luoda kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.POST_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          notifySuccess(HEARING_CREATED_MESSAGE);
        }
      })
      .catch(requestErrorHandler(dispatch, preSaveAction));
  };
}

export function saveAndPreviewNewHearing(hearing) {
  // Clean up section IDs assigned by UI before POSTing the hearing
  const cleanedHearing = cleanHearing(hearing);
  return (dispatch, getState) => {
    const preSaveAction = createAction(EditorActions.POST_HEARING, null, () => ({ fyi: 'saveAndPreview' }))({
      hearing: cleanedHearing,
    });
    dispatch(preSaveAction);
    const url = '/v1/hearing/';
    return post(getState(), url, cleanedHearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          notifyError(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
        } else if (response.status === 401) {
          // Unauthorized
          notifyError('Et voi luoda kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.POST_HEARING_SUCCESS)({ hearing: hearingJSON }));
            dispatch(createAction(EditorActions.CLOSE_FORM)());
            dispatch(push(getHearingURL(hearingJSON)));
          });
          notifySuccess(HEARING_CREATED_MESSAGE);
        }
      })
      .catch(requestErrorHandler(dispatch, preSaveAction));
  };
}

export function closeHearing(hearing) {
  return (dispatch, getState) => {
    const preCloseAction = createAction(EditorActions.CLOSE_HEARING)({ hearing });
    dispatch(preCloseAction);
    const url = `/v1/hearing/${hearing.id}`;
    const now = moment().toISOString();
    const changes = { close_at: now };
    return patch(getState(), url, changes)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 401) {
          notifyError('Et voi sulkea tätä kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          notifySuccess('Kuuleminen suljettiin');
        }
      })
      .catch(requestErrorHandler(dispatch, preCloseAction));
  };
}

export function publishHearing(hearing) {
  return (dispatch, getState) => {
    const prePublishAction = createAction(EditorActions.PUBLISH_HEARING)({ hearing });
    dispatch(prePublishAction);
    const url = `/v1/hearing/${hearing.id}`;
    const changes = { published: true };
    return patch(getState(), url, changes)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 401) {
          notifyError('Et voi julkaista tätä kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          notifySuccess('Kuuleminen julkaistiin');
        }
      })
      .catch(requestErrorHandler(dispatch, prePublishAction));
  };
}

export function unPublishHearing(hearing) {
  return (dispatch, getState) => {
    const preUnPublishAction = createAction(EditorActions.UNPUBLISH_HEARING)({ hearing });
    dispatch(preUnPublishAction);
    const url = `/v1/hearing/${hearing.id}`;
    return patch(getState(), url, { published: false })
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 401) {
          notifyError(HEARING_CANT_MODIFY);
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          notifySuccess('Muutos tallennettu');
        }
      })
      .catch(requestErrorHandler(dispatch, preUnPublishAction));
  };
}

export function updateHearingAfterSave(normalizedHearing) {
  return createAction(EditorActions.UPDATE_HEARING_AFTER_SAVE)(normalizedHearing);
}
