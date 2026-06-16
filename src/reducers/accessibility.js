import { createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  isHighContrast: false,
};

const toggleContrastState = (state) => ({
  isHighContrast: !state.isHighContrast,
});

export default createReducer(INITIAL_STATE, (builder) => {
  builder.addCase('toggleContrastState', toggleContrastState);
});
