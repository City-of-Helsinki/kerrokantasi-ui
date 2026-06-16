import { createReducer } from '@reduxjs/toolkit';

export default createReducer(
  {
    isFetching: false,
    data: [],
  },
  (builder) => {
    builder
      .addCase('fetchProjects', (state) => ({ ...state, isFetching: true }))
      .addCase(
        'receiveProjects',
        (
          _state,
          {
            payload: {
              data: { results },
            },
          }
        ) => ({ isFetching: false, data: [...results] })
      )
      .addCase('receiveProjectsError', (state) => ({
        ...state,
        isFetching: false,
      }));
  }
);
