import { handleActions } from 'redux-actions';

const INITIAL_STATE = {
  isHighContrast: false,
};

const toggleContrastState = (state) => ({
  isHighContrast: !state.isHighContrast
});

export default handleActions({ toggleContrastState }, INITIAL_STATE);
