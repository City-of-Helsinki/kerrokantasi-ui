export const getIsFetchingHearing = (state) =>
  state.hearingEditor.hearing.isFetching;

export const getIsFetchingMetaData = (state) =>
  state.hearingEditor.metaData.isFetching;

export const getIsFetching = (state) =>
  getIsFetchingHearing(state) || getIsFetchingMetaData(state);

export const getIsLoading = (state) =>
  state.pendingRequests > 0;

export const getHearing = (state) =>
  state.hearingEditor.hearing.hearing;

export const getEditorState = (state) =>
  state.hearingEditor.editorState.state;
