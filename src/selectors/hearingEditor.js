const getHearingEditor = (state) =>
  state.hearingEditor;

export const getIsFetchingHearing = (state) =>
  getHearingEditor(state).hearing.isFetching;

export const getIsFetchingMetaData = (state) =>
  getHearingEditor(state).metaData.isFetching;

export const getIsLoading = (state) =>
  getHearingEditor(state).editorState.pendingRequests > 0;

export const getHearing = (state) =>
  getHearingEditor(state).hearing.hearing;

export const getEditorState = (state) =>
  getHearingEditor(state).editorState.state;
