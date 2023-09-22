import * as LabelsSelector from './labels';
import * as SectionsSelector from './sections';
import * as ContactPersonsSelector from './contactPersons';

export const getHearingEditor = (state) =>
  state.hearingEditor;

export const getProjects = (state) =>
  getHearingEditor(state).project;

export const getIsFetchingHearing = (state) =>
  getHearingEditor(state).hearing.isFetching;

export const getIsFetchingMetaData = (state) =>
  getHearingEditor(state).labels.isFetching || getHearingEditor(state).contactPersons.isFetching;

export const getIsLoading = (state) => getHearingEditor(state).editorState.pending > 0;

export const getShowForm = (state) =>
  getHearingEditor(state).editorState.show;

export const getIsSaving = (state) =>
  getHearingEditor(state).editorState.isSaving;

export const getHearing = (state) =>
  getHearingEditor(state).hearing.data;

export const getEditorState = (state) =>
  getHearingEditor(state).editorState.state;

export const getPopulatedHearing = (state) => {
  const editor = getHearingEditor(state);
  const hearing = editor.hearing.data;
  if (!hearing) {
    return hearing;
  }
  const { contactPersons, labels, sections } = editor;

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

export const getLabelsState = (state) => getHearingEditor(state).labels;

export const getLabels = (state) => LabelsSelector.getAll(getLabelsState(state));

export const getLabelById = (state, id) => LabelsSelector.getById(getLabelsState(state), id);

/**
 * Section selectors
 */

export const getSectionsState = (state) =>
  getHearingEditor(state).sections;

export const getSections = (state) =>
  SectionsSelector.getAll(getSectionsState(state));

export const getSectionById = (state, id) =>
  SectionsSelector.getById(getSectionsState(state), id);

/**
 * Contact person selectors
 */

export const getContactPersonsState = (state) =>
  getHearingEditor(state).contactPersons;

export const getContactPersons = (state) =>
  ContactPersonsSelector.getAll(getContactPersonsState(state));

export const getContactPersonById = (state, id) =>
  ContactPersonsSelector.getById(getContactPersonsState(state), id);
