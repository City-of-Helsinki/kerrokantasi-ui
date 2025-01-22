import { createAction } from 'redux-actions';
import moment from 'moment';
import { omit } from 'lodash';

import { createNotificationPayload, NOTIFICATION_TYPES, createLocalizedNotificationPayload } from '../utils/notify';
import { patch, put, post, apiDelete, getAllFromEndpoint } from '../api';
import { requestErrorHandler } from './index';
import { initNewHearing as getHearingSkeleton } from '../utils/hearing';
import {
  fillFrontIdsAndNormalizeHearing,
  filterFrontIdsFromAttributes,
  filterTitleAndContentByLanguage,
  prepareHearingForSave,
} from '../utils/hearingEditor';
import { addToast } from './toast';
import getMessage from '../utils/getMessage';

export const EditorActions = {
  ACTIVE_PHASE: 'activePhase',
  ADD_ATTACHMENT: 'addAttachment',
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
  SET_SECTION_MAIN_IMAGE: 'setSectionMainImage',
  DELETE_SECTION_MAIN_IMAGE: 'deleteSectionMainImage',
  CHANGE_SECTION_MAIN_IMAGE_CAPTION: 'changeSectionMainImageCaption',
  EDIT_SECTION: 'changeSection',
  ERROR_META_DATA: 'errorHearingEditorMetaData',
  FETCH_META_DATA: 'beginFetchHearingEditorMetaData',
  FETCH_CONTACT_PERSONS: 'beginFetchHearingEditorContactPersons',
  INIT_MULTIPLECHOICE_QUESTION: 'initMultipleChoiceQuestion',
  INIT_NEW_HEARING: 'initNewHearing',
  INIT_SINGLECHOICE_QUESTION: 'initSingleChoiceQuestion',
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

export const startHearingEdit = () => dispatch => dispatch(createAction(EditorActions.SHOW_FORM)());

export const closeHearingForm = () => dispatch => dispatch(createAction(EditorActions.CLOSE_FORM)());

export const sectionMoveUp = (sectionId) => dispatch => dispatch(createAction(EditorActions.SECTION_MOVE_UP)(sectionId));

export const sectionMoveDown = (sectionId) => dispatch => dispatch(createAction(EditorActions.SECTION_MOVE_DOWN)(sectionId));

/**
 * Delete an attached item.
 * @param {String} sectionId - id of the section the attachment belongs to.
 * @param {Object} attachment - attachment in a section or independant of.
 * @reuturns Promise.
 */
export const deleteSectionAttachment = (sectionId, attachment) => (dispatch) => {
  const { id, file } = attachment;

  const url = `/v1/file/${id}`;
  return apiDelete(url, file)
    .then(checkResponseStatus)
    .then(() => dispatch(createAction(EditorActions.DELETE_ATTACHMENT)({ sectionId, attachment })));
};

export const changeProject = (projectId, projectLists) => createAction(EditorActions.CHANGE_PROJECT)(projectId, projectLists);

export const updateProjectLanguage = (languages) => createAction(EditorActions.UPDATE_PROJECT_LANGUAGE)({ languages });

export const changeProjectName = (fieldname, value) => createAction(EditorActions.CHANGE_PROJECT_NAME)({ fieldname, value });

export const deletePhase = (phaseId) => createAction(EditorActions.DELETE_PHASE)({ phaseId });

export const activePhase = (phaseId) => createAction(EditorActions.ACTIVE_PHASE)({ phaseId });

export function changePhase(phaseId, fieldName, language, value) {
  return createAction(EditorActions.EDIT_PHASE)({
    phaseId,
    fieldName,
    language,
    value
  });
}

export const addPhase = () => createAction(EditorActions.ADD_PHASE)();

export const receiveHearing = (normalizedHearing) => createAction(EditorActions.RECEIVE_HEARING)(normalizedHearing);

export const initNewHearing = () => createAction(EditorActions.INIT_NEW_HEARING)(fillFrontIdsAndNormalizeHearing(getHearingSkeleton()));

/**
 * Fetch meta data required by hearing editor. Such meta data can be for example
 * list of available labels and contact persons.
 * Fetched meta data will be dispatched onwards so that it can be reduced as needed.
 */
export function fetchHearingEditorMetaData() {
  return (dispatch) => {
    const fetchAction = createAction(EditorActions.FETCH_META_DATA)();
    dispatch(fetchAction);
    return Promise.all([
      /* labels */ getAllFromEndpoint('/v1/label/'),
      /* organizations */ getAllFromEndpoint('/v1/organization/'),
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
          requestErrorHandler(dispatch)(err instanceof Error ? err : JSON.stringify(err));
        }
      }
      )
  };
}

export function fetchHearingEditorContactPersons() {
  return (dispatch) => {
    const fetchAction = createAction(EditorActions.FETCH_CONTACT_PERSONS)();
    dispatch(fetchAction);
    return Promise.all([
    /* contacts */ getAllFromEndpoint('/v1/contact_person/'),
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
          requestErrorHandler(dispatch)(err instanceof Error ? err : JSON.stringify(err));
        }
      });
  };
}

export const changeHearing = (field, value) => dispatch => dispatch(createAction(EditorActions.EDIT_HEARING)({ field, value }));

export const addContact = (contact, selectedContacts) => async dispatch => {
  const url = '/v1/contact_person/';
  await post(url, contact)
    .then(checkResponseStatus)
    .then(async response => {
      if (response.status === 400) {
        // Bad request with error message
        throw Error('Tarkista yhteyshenkilön tiedot.');
      } else if (response.status === 401) {
        // Unauthorized
        throw Error('Et voi luoda yhteyshenkilöä.');
      } else {
        await response.json().then(async contactJSON => {
          selectedContacts.push(contactJSON.id);
          await dispatch(changeHearing('contact_persons', selectedContacts));
        });
        // TODO: Add translations
        dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, HEARING_CREATED_MESSAGE)));
      }
    })
    .then(async () => await dispatch(fetchHearingEditorContactPersons()))
    .catch((err) => {
      requestErrorHandler(dispatch)(err);
      return Promise.reject(err);
    }).finally(() => true)
};

export function saveContact(contact) {
  return (dispatch) => {
    const url = `/v1/contact_person/${contact.id}/`;
    const contactInfo = omit(contact, ['id']);
    return put(url, contactInfo)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // TODO: Add translation
          throw Error('Sinulla ei ole oikeutta muokata yhteyshenkilöä.');
        } else if (response.status === 401) {
          // Unauthorized
          // TODO: Add translation
          throw Error('Et voi luoda yhteyshenkilöä.');
        } else {
          // TODO: Add translation
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Muokkaus onnistui')));
        }
      })
      .then(() => dispatch(fetchHearingEditorContactPersons()))
      .catch(requestErrorHandler(dispatch));
  };
}

export function addLabel(label, selectedLabels) {
  return (dispatch) => {
    const postLabelAction = createAction(EditorActions.ADD_LABEL)();
    dispatch(postLabelAction);
    const url = '/v1/label/';
    return post(url, label)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          // TODO: Add translations
          response.json().then(errors => {
            dispatch(createAction(EditorActions.ADD_LABEL_FAILED)({ errors }));
          });
          throw Error('Tarkista asiasanan tiedot.');
        } else if (response.status === 401) {
          // Unauthorized
          // TODO: Add translations
          throw Error('Et voi luoda asiasanaa.');
        } else {
          response.json().then(labelJSON => {
            selectedLabels.push(labelJSON.id);
            dispatch(createAction(EditorActions.ADD_LABEL_SUCCESS)({ label: labelJSON }));
            dispatch(changeHearing('labels', selectedLabels));
          });
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, HEARING_CREATED_MESSAGE)));
        }
      })
      .then(() => dispatch(fetchHearingEditorMetaData()))
      .catch(requestErrorHandler(dispatch));
  };
}

export const changeSection = (sectionID, field, value) => dispatch => dispatch(createAction(EditorActions.EDIT_SECTION)({ sectionID, field, value }));

export const setSectionMainImage = (sectionID, value) => dispatch => dispatch(createAction(EditorActions.SET_SECTION_MAIN_IMAGE)({ sectionID, value }));

export const deleteSectionMainImage = (sectionID) => dispatch => dispatch(createAction(EditorActions.DELETE_SECTION_MAIN_IMAGE)({ sectionID }));

export const changeSectionMainImageCaption = (sectionID, value) => dispatch => dispatch(createAction(EditorActions.CHANGE_SECTION_MAIN_IMAGE_CAPTION)({ sectionID, value }));

export const addSection = (section) => dispatch => dispatch(createAction(EditorActions.ADD_SECTION)({ section }));

export const createMapMarker = (value) => dispatch => dispatch(createAction(EditorActions.CREATE_MAP_MARKER)({ value }));

export const addMapMarker = (value) => dispatch => dispatch(createAction(EditorActions.ADD_MAP_MARKER)({ value }));

export const addMapMarkerToCollection = (value) => dispatch => dispatch(createAction(EditorActions.ADD_MAP_MARKER_TO_COLLECTION)({ value }));

export const initSingleChoiceQuestion = (sectionId) => dispatch => dispatch(createAction(EditorActions.INIT_SINGLECHOICE_QUESTION)({ sectionId }));

export const initMultipleChoiceQuestion = (sectionId) => dispatch => dispatch(createAction(EditorActions.INIT_MULTIPLECHOICE_QUESTION)({ sectionId }));

export const clearQuestions = (sectionId) => dispatch => dispatch(createAction(EditorActions.CLEAR_QUESTIONS)({ sectionId }));

export const addOption = (sectionId, questionId) => dispatch => dispatch(createAction(EditorActions.ADD_OPTION)({ sectionId, questionId }));

export const editQuestion = (fieldType, sectionId, questionId, optionKey, value) => dispatch => dispatch(createAction(EditorActions.EDIT_QUESTION)({ fieldType, sectionId, questionId, value, optionKey }));

export const deleteTemporaryQuestion = (sectionId, questionFrontId) => createAction(EditorActions.DELETE_TEMP_QUESTION)({ sectionId, questionFrontId });

export const deleteLastOption = (sectionId, questionId, optionKey) => dispatch => dispatch(createAction(EditorActions.DELETE_LAST_OPTION)({ sectionId, questionId, optionKey }));

export const deleteExistingQuestion = (sectionId, questionId) => dispatch => dispatch(createAction(EditorActions.DELETE_EXISTING_QUESTION)({ sectionId, questionId }));

/*
* Removes section from hearing
* @param {str} sectionID - Is compared to section.id and section.frontId in that order
 */
export const removeSection = (sectionID) => dispatch => dispatch(createAction(EditorActions.REMOVE_SECTION)({ sectionID }));

export const changeHearingEditorLanguages = (languages) => dispatch => dispatch(createAction(EditorActions.SET_LANGUAGES)({ languages }));

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
    return put(url, cleanedHearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          // TODO: Add translations
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
          throw Error(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
        } else if (response.status === 401) {
          // Unauthorized
          // TODO: Add translations
          throw Error(HEARING_CANT_MODIFY);
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
            dispatch(closeHearingForm());
            if (hearing.slug !== hearingJSON.slug) {
              dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'slugInUse')));
            }

          });
          // TODO: Add translations
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Tallennus onnistui')));
        }
      })
      .catch(requestErrorHandler(dispatch));
  };
}

/**
 * Method that will be used to upload the file to the server.
 * @param {Document} section - attachments to be uploaded.
 */
export function addSectionAttachment(section, file, title, isNew) {
  // This method is a little different to exisitn methods as it uploads as soon as user selects file.
  return (dispatch) => {
    const url = '/v1/file';

    const data = { file, title };
    return post(url, data)
      .then(checkResponseStatus)
      .then((response) => {
        if (response.status === 400 && !isNew) {
          throw Error(getMessage('errorSaveBeforeAttachment'));
        } else {
          response.json().then((attachment) => dispatch(createAction(EditorActions.ADD_ATTACHMENT)({ sectionId: section, attachment: { ...attachment, isNew: true } })));
        }
      })
      .catch(requestErrorHandler(dispatch));
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
    return put(url, cleanedHearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
          // TODO: Add translations
          throw Error(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
        } else if (response.status === 401) {
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.error, HEARING_CANT_MODIFY)));
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
          // Unauthorized
          // TODO: Add translations
          throw Error(HEARING_CANT_MODIFY);
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
            dispatch(createAction(EditorActions.CLOSE_FORM)());
          });
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Tallennus onnistui')));
        }
      })
      .catch(requestErrorHandler(dispatch));
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
    return post(url, cleanedHearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          // TODO: Add translations
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
          throw Error(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
        } else if (response.status === 401) {
          // Unauthorized
          // TODO: Add translations
          throw Error('Et voi luoda kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.POST_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          // TODO: Add translations
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, HEARING_CREATED_MESSAGE)));
        }
      })
      .catch(requestErrorHandler(dispatch));
  };
}

export function saveAndPreviewNewHearing(hearing) {
  return (dispatch) => {
    const preSaveAction = createAction(EditorActions.POST_HEARING, null, () => ({ fyi: 'saveAndPreview' }))({
      hearing,
    });
    dispatch(preSaveAction);
    const url = '/v1/hearing/';
    return post(url, hearing)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 400) {
          // Bad request with error message
          // TODO: Add translations
          response.json().then(errors => {
            dispatch(createAction(EditorActions.SAVE_HEARING_FAILED)({ errors }));
          });
          throw Error(HEARING_CHECK_HEARING_INFORMATION_MESSAGE);
        } else if (response.status === 401) {
          // Unauthorized
          // TODO: Add translations
          throw Error('Et voi luoda kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.POST_HEARING_SUCCESS)({ hearing: hearingJSON }));
            dispatch(createAction(EditorActions.CLOSE_FORM)());
          });
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, HEARING_CREATED_MESSAGE)));
        }
      })
      .catch(requestErrorHandler(dispatch));
  };
}

export function saveAndPreviewHearingAsCopy(hearing) {
  const preparedHearing = prepareHearingForSave(hearing);
  return saveAndPreviewNewHearing(preparedHearing);
}

export function closeHearing(hearing) {
  return (dispatch) => {
    const preCloseAction = createAction(EditorActions.CLOSE_HEARING)({ hearing });
    dispatch(preCloseAction);
    const url = `/v1/hearing/${hearing.id}`;
    const now = moment().toISOString();
    const changes = { close_at: now };
    return patch(url, changes)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 401) {
          // TODO: Add translations
          throw Error('Et voi sulkea tätä kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          // TODO: Add translations
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Kuuleminen suljettiin')));
        }
      })
      .catch(requestErrorHandler(dispatch));
  };
}

export function publishHearing(hearing) {
  return (dispatch) => {
    const prePublishAction = createAction(EditorActions.PUBLISH_HEARING)({ hearing });
    dispatch(prePublishAction);
    const url = `/v1/hearing/${hearing.id}`;
    const changes = { published: true };
    return patch(url, changes)
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 401) {
          // TODO: Add translations
          throw Error('Et voi julkaista tätä kuulemista.');
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          // TODO: Add translations
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Kuuleminen julkaistiin')));
        }
      })
      .catch(requestErrorHandler(dispatch));
  };
}

export function unPublishHearing(hearing) {
  return (dispatch) => {
    const preUnPublishAction = createAction(EditorActions.UNPUBLISH_HEARING)({ hearing });
    dispatch(preUnPublishAction);
    const url = `/v1/hearing/${hearing.id}`;
    return patch(url, { published: false })
      .then(checkResponseStatus)
      .then(response => {
        if (response.status === 401) {
          // TODO: Add translations
          throw Error(HEARING_CANT_MODIFY);
        } else {
          response.json().then(hearingJSON => {
            dispatch(createAction(EditorActions.SAVE_HEARING_SUCCESS)({ hearing: hearingJSON }));
          });
          // TODO: Add translations
          dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Muutos tallennettu')));
        }
      })
      .catch(requestErrorHandler(dispatch));
  };
}

export const updateHearingAfterSave = (normalizedHearing) => createAction(EditorActions.UPDATE_HEARING_AFTER_SAVE)(normalizedHearing);
