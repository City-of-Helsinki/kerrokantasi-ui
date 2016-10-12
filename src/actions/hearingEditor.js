import {createAction} from 'redux-actions';
import api from '../api';
import {notifySuccess, notifyError} from '../utils/notify';
import moment from 'moment';
import Promise from 'bluebird';

import {getResponseJSON, requestErrorHandler} from './index';


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
    return dispatch(createAction("showHearingForm")());
  };
}


export function closeHearingForm() {
  return (dispatch) => {
    return dispatch(createAction("closeHearingForm")());
  };
}


export function beginCreateHearing() {
  return (dispatch) => {
    return dispatch(createAction("beginCreateHearing")());
  };
}


export function beginEditHearing(hearing) {
  return (dispatch) => {
    return dispatch(createAction("beginEditHearing")({hearing}));
  };
}

/**
 * Fetch meta data required by hearing editor. Such meta data can be for example
 * list of available labels and contact persons.
 * Fetched meta data will be dispatched onwards so that it can be reduced as needed.
 */
export function fetchHearingEditorMetaData() {
  return (dispatch, getState) => {
    const fetchAction = createAction("beginFetchHearingEditorMetaData")();
    return Promise.props({
      labels: api.get(getState(), "/v1/label/").then(getResponseJSON),
      contacts: api.get(getState(), "/v1/contact_person/").then(getResponseJSON),
    }).then(({labels, contacts}) => {
      dispatch(createAction("receiveHearingEditorMetaData")({
        // Unwrap the DRF responses:
        labels: labels.results,
        contacts: contacts.results,
      }));
    }).catch(requestErrorHandler(dispatch, fetchAction));
  };
}

export function changeHearing(field, value) {
  return (dispatch) => {
    return dispatch(createAction("changeHearing")({field, value}));
  };
}

export function changeSection(sectionID, field, value) {
  return (dispatch) => {
    return dispatch(createAction("changeSection")({sectionID, field, value}));
  };
}

export function changeSectionMainImage(sectionID, field, value) {
  return (dispatch) => {
    return dispatch(createAction("changeSectionMainImage")({sectionID, field, value}));
  };
}

export function addSection(section) {
  return (dispatch) => {
    return dispatch(createAction("addSection")({section}));
  };
}


/*
* Removes section from hearing
* @param {str} sectionID - Is compared to section.id and section.frontID in that order
 */
export function removeSection(sectionID) {
  return (dispatch) => {
    return dispatch(createAction("removeSection")({sectionID}));
  };
}


/*
* Save changes made to an existing hearing.
* Passed hearing should represent the new state of the hearing.
* Hearing ID is used to determine which hearing gets updated.
 */
export function saveHearingChanges(hearing) {
  return (dispatch, getState) => {
    const preSaveAction = createAction("savingHearingChange")({hearing});
    dispatch(preSaveAction);
    const url = "/v1/hearing/" + hearing.id;
    return api.put(getState(), url, hearing).then(checkResponseStatus).then((response) => {
      if (response.status === 400) {  // Bad request with error message
        notifyError("Tarkista kuulemisen tiedot.");
        response.json().then((errors) => {
          dispatch(createAction("saveHearingFailed")({errors}));
        });
      } else if (response.status === 401) {  // Unauthorized
        notifyError("Et voi muokata tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction("savedHearingChange")({hearing: hearingJSON}));
        });
        notifySuccess("Tallennus onnistui");
      }
    }).then({

    }).catch(requestErrorHandler(dispatch, preSaveAction));
  };
}


export function saveNewHearing(hearing) {
  return (dispatch, getState) => {
    const preSaveAction = createAction("savingNewHearing")({hearing});
    dispatch(preSaveAction);
    const url = "/v1/hearing/";
    return api.post(getState(), url, hearing).then(checkResponseStatus).then((response) => {
      if (response.status === 400) {  // Bad request with error message
        notifyError("Tarkista kuulemisen tiedot.");
        response.json().then((errors) => {
          dispatch(createAction("saveHearingFailed")({errors}));
        });
      } else if (response.status === 401) {  // Unauthorized
        notifyError("Et voi luoda kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction("savedNewHearing")({hearing: hearingJSON}));
        });
        notifySuccess("Luonti onnistui");
      }
    }).catch(requestErrorHandler(dispatch, preSaveAction));
  };
}


export function closeHearing(hearing) {
  return (dispatch, getState) => {
    const preCloseAction = createAction("closingHearing")({hearing});
    dispatch(preCloseAction);
    const url = "/v1/hearing/" + hearing.id;
    const now = moment().toISOString();
    const changes = {close_at: now};
    return api.patch(getState(), url, changes).then(checkResponseStatus).then((response) => {
      if (response.status === 401) {
        notifyError("Et voi sulkea tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction("savedHearingChange")({hearing: hearingJSON}));
        });
        notifySuccess("Kuuleminen suljettiin");
      }
    }).catch(requestErrorHandler(dispatch, preCloseAction));
  };
}


export function publishHearing(hearing) {
  return (dispatch, getState) => {
    const prePublishAction = createAction("publishingHearing")({hearing});
    dispatch(prePublishAction);
    const url = "/v1/hearing/" + hearing.id;
    const changes = {published: true};
    return api.patch(getState(), url, changes).then(checkResponseStatus).then((response) => {
      if (response.status === 401) {
        notifyError("Et voi julkaista tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction("savedHearingChange")({hearing: hearingJSON}));
        });
        notifySuccess("Kuuleminen julkaistiin");
      }
    }).catch(requestErrorHandler(dispatch, prePublishAction));
  };
}


export function unPublishHearing(hearing) {
  return (dispatch, getState) => {
    const preUnPublishAction = createAction("unPublishingHearing")({hearing});
    dispatch(preUnPublishAction);
    const url = "/v1/hearing/" + hearing.id;
    return api.patch(getState(), url, {published: false}).then(checkResponseStatus).then((response) => {
      if (response.status === 401) {
        notifyError("Et voi muokata tätä kuulemista.");
      } else {
        response.json().then((hearingJSON) => {
          dispatch(createAction("savedHearingChange")({hearing: hearingJSON}));
        });
        notifySuccess("Muutos tallennettu");
      }
    }).catch(requestErrorHandler(dispatch, preUnPublishAction));
  };
}
