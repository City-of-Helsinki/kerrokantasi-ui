
import { get } from 'lodash';
import { normalize } from 'normalizr';

import {
  EditorActions,
  receiveHearing,
  updateHearingAfterSave
} from '../actions/hearingEditor';
import { fillFrontId, fillFrontIds, fillFrontIdsAndNormalizeHearing } from '../utils/hearingEditor';
import { labelResultsSchema, contactPersonResultsSchema, OrganizationResultsSchema } from '../types';


export const normalizeReceivedHearing =
  ({ dispatch }) => (next) => (action) => {
    const NORMALIZE_ACTIONS = ['receiveHearing'];
    if (NORMALIZE_ACTIONS.includes(action.type)) {
      const hearing = get(action, 'payload.data');
      dispatch(receiveHearing(fillFrontIdsAndNormalizeHearing(hearing)));
    }
    next(action);
  };

export const normalizeReceiveEditorMetaData =
  () => (next) => (action) => {
    if (action.type === EditorActions.RECEIVE_META_DATA) {
      const labels = get(action, 'payload.labels');
      const organizations = get(action, 'payload.organizations');
      const normalizedMetaData = {
        labels: normalize(fillFrontIds(labels), labelResultsSchema),
        organizations: normalize(fillFrontIds(organizations), OrganizationResultsSchema),
      };
      next({
        type: action.type,
        payload: normalizedMetaData,
      });
    } else {
      next(action);
    }
  };

export const normalizeReceiveEditorContactPersons =
  () => (next) => (action) => {
    if (action.type === EditorActions.RECEIVE_CONTACT_PERSONS) {
      const contacts = get(action, 'payload.contactPersons');
      const normalizedMetaData = {
        contactPersons: normalize(fillFrontIds(contacts), contactPersonResultsSchema),
      };
      next({
        type: action.type,
        payload: normalizedMetaData,
      });
    } else {
      next(action);
    }
  };

export const normalizeSavedHearing =
  ({ dispatch }) => (next) => (action) => {
    const NORMALIZE_ACTIONS = [EditorActions.POST_HEARING_SUCCESS, EditorActions.SAVE_HEARING_SUCCESS];

    if (NORMALIZE_ACTIONS.includes(action.type)) {
      const hearing = get(action, 'payload.hearing');
      dispatch(updateHearingAfterSave(fillFrontIdsAndNormalizeHearing(hearing)));
    }
    next(action);
  };

export const sectionFrontIds = () => (next) => (action) => {
  const SECTION_ACTIONS = [
    EditorActions.ADD_SECTION,
  ];

  if (SECTION_ACTIONS.includes(action.type)) {
    next({
      type: action.type,
      payload: {
        ...action.payload,
        section: fillFrontId(get(action, 'payload.section'))
      }
    });
  } else {
    next(action);
  }
};

export default [
  sectionFrontIds,
  normalizeReceiveEditorMetaData,
  normalizeReceiveEditorContactPersons,
  normalizeReceivedHearing,
  normalizeSavedHearing
];
