// @flow
import {EditorActions, receiveHearing} from '../actions/hearingEditor';
import {fillFrontId, fillFrontIdsAndNormalizeHearing} from '../utils/hearingEditor';

export const normalizeReceivedHearing =
  ({dispatch}: {dispatch: () => void}) => (next: () => any) => (action: {type: string, payload: Object}) => {
    const NORMALIZE_ACTIONS = ['receiveHearing'];
    if (NORMALIZE_ACTIONS.includes(action.type)) {
      const hearing = action.payload.data;
      dispatch(receiveHearing(fillFrontIdsAndNormalizeHearing(hearing)));
    }
    next(action);
  };

export const normalizeSavedHearing =
  () => (next: () => any) => (action: {type: string, payload: Object}) => {
    const NORMALIZE_ACTIONS = [EditorActions.POST_HEARING_SUCCESS, EditorActions.SAVE_HEARING_SUCCESS];

    if (NORMALIZE_ACTIONS.includes(action.type)) {
      const hearing = action.payload.hearing;
      next({
        ...action,
        payload: {
          ...action.payload,
          hearing: fillFrontIdsAndNormalizeHearing(hearing),
        },
      });
    } else {
      next(action);
    }
  };

export const sectionFrontIds = () => (next: () => any) => (action: Object) => {
  const SECTION_ACTIONS = [
    EditorActions.ADD_SECTION,
  ];

  if (SECTION_ACTIONS.includes(action.type)) {
    next({
      ...action,
      payload: {
        ...action.payload,
        section: fillFrontId(action.payload.section)
      }
    });
  } else {
    next(action);
  }
};

export default [
  sectionFrontIds,
  normalizeReceivedHearing,
  normalizeSavedHearing,
];
