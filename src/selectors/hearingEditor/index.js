
export const getHearingEditor = (state) =>
  state.hearingEditor;

export const getIsFetchingHearing = (state) =>
  getHearingEditor(state).hearing.isFetching;

export const getIsFetchingMetaData = (state) =>
  getHearingEditor(state).metaData.isFetching;

export const getIsLoading = (state) =>
  getHearingEditor(state).editorState.pending > 0;

export const getShowForm = (state) =>
  getHearingEditor(state).editorState.show;

export const getIsSaving = (state) =>
  getHearingEditor(state).editorState.isSaving;

export const getHearing = (state) =>
  getHearingEditor(state).hearing.hearing;

export const getEditorState = (state) =>
  getHearingEditor(state).editorState.state;

export * from './section';
