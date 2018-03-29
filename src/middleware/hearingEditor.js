// @flow
import {get, isEmpty, head, difference} from 'lodash';
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

export const replaceWithDefaultProject = store => next => action => {
  if (action.type === EditorActions.RECEIVE_HEARING) {
    const {entities, result} = action.payload;
    const hearing = entities.hearing[result];
    if (isEmpty(hearing.project)) {
      return next(updeep({
        payload: {entities: {
          hearing: {
            [result]: {project: store.getState().projectLists.data[0]}
          }
        }}
      }, action));
    }
  }
  return next(action);
};

export const updateNewHearingWithDefaultProject = () => next => action => {
  if (action.type === EditorActions.INIT_NEW_HEARING) {
    const {entities} = action.payload;
    const hearingId = head(Object.keys(entities.hearing));
    const hearing = entities.hearing[hearingId];
    if (isEmpty(hearing.project)) {
      return next(updeep({
        payload: {entities: {
          hearing: {
            [hearingId]: {
              project: {id: '', title: {fi: ''}, phases: []}
            }
          }
        }}
      }, action));
    }
  }
  return next(action);
};

export const updateProjectOnChangeLanguage = store => next => action => {
  if (action.type === EditorActions.SET_LANGUAGES) {
    const languages = action.payload.languages;
    store.dispatch(updateProjectLanguage(languages));
    // update and refetch default project if needed
    store.dispatch(updateDefaultProject(languages));
    const edittedHearing = store.getState().hearingEditor.hearing;
    if (edittedHearing.data.project && edittedHearing.data.project.id === '') {
      store.dispatch(changeProject({
        projectId: '',
        projectLists: store.getState().projectLists.data
      }));
    }
  }
  return next(action);
};

export const updatePhasesOnChangeLanguage = store => next => action => {
  if (action.type === EditorActions.SET_LANGUAGES) {
    const languages = action.payload.languages;
    const phases = store.getState().hearingEditor.hearing.data.project.phases;
    phases.forEach(phase => {
      const newLanguagesTitle = difference(languages, Object.keys(phase.title));
      const newLanguagesSchedule = difference(languages, Object.keys(phase.schedule));
      const newLanguagesDescription = difference(languages, Object.keys(phase.description));
      const removedLanguagesTitle = difference(Object.keys(phase.title), languages);
      const removedLanguagesSchedule = difference(Object.keys(phase.schedule), languages);
      const removedLanguagesDescription = difference(Object.keys(phase.description), languages);
      if (!isEmpty(newLanguagesTitle)) {
        newLanguagesTitle.map(language => store.dispatch(changePhase(phase.id, 'title', language, '')));
      } else {
        removedLanguagesTitle.map(language => store.dispatch(changePhase(phase.id, 'title', language, undefined)));
      }
      if (!isEmpty(newLanguagesSchedule)) {
        newLanguagesSchedule.map(language => store.dispatch(changePhase(phase.id, 'schedule', language, '')));
      } else {
        removedLanguagesSchedule.map(
          language => store.dispatch(changePhase(phase.id, 'schedule', language, undefined))
        );
      }
      if (!isEmpty(newLanguagesDescription)) {
        newLanguagesDescription.map(
          language => store.dispatch(changePhase(phase.id, 'description', language, ''))
        );
      } else {
        removedLanguagesDescription.map(
          language => store.dispatch(changePhase(phase.id, 'description', language, undefined))
        );
      }
    });
  }
  next(action);
};

export default [
  sectionFrontIds,
  normalizeReceiveEditorMetaData,
  normalizeReceivedHearing,
  normalizeSavedHearing,
  replaceWithDefaultProject,
  updateNewHearingWithDefaultProject,
  updateProjectOnChangeLanguage,
  updatePhasesOnChangeLanguage
];
