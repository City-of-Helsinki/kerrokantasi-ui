// @flow
import type {AppState} from '../../types';
import * as LabelsSelector from './labels';
import * as SectionsSelector from './sections';
import * as ContactPersonsSelector from './contactPersons';

export const getHearingEditor = (state: AppState) =>
  state.hearingEditor;

export const getProjects = (state: AppState) =>
  getHearingEditor(state).projects;

export const getIsFetchingHearing = (state: AppState) =>
  getHearingEditor(state).hearing.isFetching;

export const getIsFetchingMetaData = (state: AppState) =>
  getHearingEditor(state).labels.isFetching || getHearingEditor(state).contactPersons.isFetching;

export const getIsLoading = (state: AppState) => {
  return getHearingEditor(state).editorState.pending > 0;
};

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

/**
 * Label selectors
 */

export const getLabelsState = (state: AppState) => getHearingEditor(state).labels;

export const getLabels = (state: AppState) => LabelsSelector.getAll(getLabelsState(state));

export const getLabelById = (state: AppState, id: string) => LabelsSelector.getById(getLabelsState(state), id);

/**
 * Section selectors
 */

export const getSectionsState = (state: AppState) =>
  getHearingEditor(state).sections;

export const getSections = (state: AppState) =>
  SectionsSelector.getAll(getSectionsState(state));

export const getSectionById = (state: AppState, id: string) =>
  SectionsSelector.getById(getSectionsState(state), id);

/**
 * Contact person selectors
 */

export const getContactPersonsState = (state: AppState) =>
  getHearingEditor(state).contactPersons;

export const getContactPersons = (state: AppState) =>
  ContactPersonsSelector.getAll(getContactPersonsState(state));

export const getContactPersonById = (state: AppState, id: string) =>
  ContactPersonsSelector.getById(getContactPersonsState(state), id);
