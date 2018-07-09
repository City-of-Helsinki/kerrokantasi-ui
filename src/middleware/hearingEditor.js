// @flow
import {get, isEmpty, head, difference, keys} from 'lodash';
import updeep from 'updeep';
import {normalize} from 'normalizr';

import {
  EditorActions, receiveHearing, changeProject,
  updateHearingAfterSave, updateProjectLanguage,
  changePhase, updateDefaultProject} from '../actions/hearingEditor';
import {fillFrontId, fillFrontIds, fillFrontIdsAndNormalizeHearing} from '../utils/hearingEditor';
import {labelResultsSchema, contactPersonResultsSchema} from '../types';

type FSA = {|
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
|};

export const normalizeReceivedHearing =
  ({dispatch}: {dispatch: (action: FSA) => void}) => (next: (action: FSA) => any) => (action: FSA) => {
    const NORMALIZE_ACTIONS = ['receiveHearing'];
    if (NORMALIZE_ACTIONS.includes(action.type)) {
      const hearing = get(action, 'payload.data');
      dispatch(receiveHearing(fillFrontIdsAndNormalizeHearing(hearing)));
    }
    next(action);
  };

export const normalizeReceiveEditorMetaData =
  () => (next: (action: FSA) => any) => (action: FSA) => {
    if (action.type === EditorActions.RECEIVE_META_DATA) {
      const labels = get(action, 'payload.labels');
      const contacts = get(action, 'payload.contactPersons');
      const normalizedMetaData = {
        labels: normalize(fillFrontIds(labels), labelResultsSchema),
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
  ({dispatch}: {dispatch: (action: FSA) => void}) => (next: (action: FSA) => any) => (action: FSA) => {
    const NORMALIZE_ACTIONS = [EditorActions.POST_HEARING_SUCCESS, EditorActions.SAVE_HEARING_SUCCESS];

    if (NORMALIZE_ACTIONS.includes(action.type)) {
      const hearing = get(action, 'payload.hearing');
      dispatch(updateHearingAfterSave(fillFrontIdsAndNormalizeHearing(hearing)));
    }
    next(action);
  };

export const sectionFrontIds = () => (next: (action: FSA) => any) => (action: FSA) => {
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

// export const updateProjectOnChangeLanguage = store => next => action => {
//   if (action.type === EditorActions.SET_LANGUAGES) {
//     const languages = action.payload.languages;
//     store.dispatch(updateProjectLanguage(languages));
//     // update and refetch default project if needed
//     store.dispatch(updateDefaultProject(languages));
//   }
//   return next(action);
// };

// export const updatePhasesOnChangeLanguage = store => next => action => {
//   if (action.type === EditorActions.SET_LANGUAGES) {
//     const languages = action.payload.languages;
//     const phases = store.getState().hearingEditor.hearing.data.project.phases;
//     phases.forEach(phase => {
//       const newLanguagesTitle = difference(languages, keys(phase.title));
//       const newLanguagesSchedule = difference(languages, keys(phase.schedule));
//       const newLanguagesDescription = difference(languages, keys(phase.description));
//       const removedLanguagesTitle = difference(keys(phase.title), languages);
//       const removedLanguagesSchedule = difference(keys(phase.schedule), languages);
//       const removedLanguagesDescription = difference(keys(phase.description), languages);
//       if (!isEmpty(newLanguagesTitle)) {
//         newLanguagesTitle.map(language => store.dispatch(changePhase(phase.id || phase.frontId, 'title', language, '')));
//       } else {
//         removedLanguagesTitle.map(language => store.dispatch(changePhase(phase.id || phase.frontId, 'title', language, undefined)));
//       }
//       if (!isEmpty(newLanguagesSchedule)) {
//         newLanguagesSchedule.map(language => store.dispatch(changePhase(phase.id || phase.frontId, 'schedule', language, '')));
//       } else {
//         removedLanguagesSchedule.map(
//           language => store.dispatch(changePhase(phase.id || phase.frontId, 'schedule', language, undefined))
//         );
//       }
//       if (!isEmpty(newLanguagesDescription)) {
//         newLanguagesDescription.map(
//           language => store.dispatch(changePhase(phase.id || phase.frontId, 'description', language, ''))
//         );
//       } else {
//         removedLanguagesDescription.map(
//           language => store.dispatch(changePhase(phase.id || phase.frontId, 'description', language, undefined))
//         );
//       }
//     });
//   }
//   next(action);
// };

export default [
  sectionFrontIds,
  normalizeReceiveEditorMetaData,
  normalizeReceivedHearing,
  normalizeSavedHearing
  // updateProjectOnChangeLanguage,
  // updatePhasesOnChangeLanguage
];
