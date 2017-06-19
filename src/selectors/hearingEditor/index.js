// @flow
import type {AppState} from '../../types';

export const getHearingEditor = (state: AppState) =>
  state.hearingEditor;

export const getIsFetchingHearing = (state: AppState) =>
  getHearingEditor(state).hearing.isFetching;

export const getIsFetchingMetaData = (state: AppState) =>
  getHearingEditor(state).labels.isFetching || getHearingEditor(state).contactPersons.isFetching;

export const getIsLoading = (state: AppState) =>
  getHearingEditor(state).editorState.pending > 0;

export const getShowForm = (state: AppState) =>
  getHearingEditor(state).editorState.show;

export const getIsSaving = (state: AppState) =>
  getHearingEditor(state).editorState.isSaving;

export const getHearing = (state: AppState) =>
  getHearingEditor(state).hearing.data;

export const getEditorState = (state: AppState) =>
  getHearingEditor(state).editorState.state;

export const getPopulatedHearing = (state: AppState) => {
  const editor = getHearingEditor(state);
  const hearing = editor.hearing.data;
  if (!hearing) {
    return hearing;
  }
  const contactPersons = editor.contactPersons;
  const labels = editor.labels;
  const sections = editor.sections;

  return ({
    ...hearing,
    contact_persons: hearing.contact_persons.map(frontId => contactPersons.byId[frontId]),
    labels: hearing.labels.map(frontId => labels.byId[frontId]),
    sections: hearing.sections.map(frontId => sections.byId[frontId]),
  });
};

export * from './section';
