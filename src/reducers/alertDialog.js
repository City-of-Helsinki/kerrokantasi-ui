import { HIDE_ALERT_DIALOG, SHOW_ALERT_DIALOG } from '../actions/alertDialog';

const INITIAL_STATE = null;

const alertDialogReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_ALERT_DIALOG:
      return action.payload;
    case HIDE_ALERT_DIALOG:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default alertDialogReducer;
