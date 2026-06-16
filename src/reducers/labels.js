import { createReducer } from '@reduxjs/toolkit';

const beginFetchLabels = (state) => ({ ...state, isFetching: true });

const receiveLabels = (_state, { payload }) => ({
  isFetching: false,
  data: payload.data,
});

export default createReducer({ isFetching: false, data: [] }, (builder) => {
  builder
    .addCase('beginFetchLabels', beginFetchLabels)
    .addCase('receiveLabels', receiveLabels);
});
