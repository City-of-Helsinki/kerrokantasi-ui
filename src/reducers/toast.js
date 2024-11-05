import { ADD_TOAST, REMOVE_TOAST } from '../actions/toast';

const INITIAL_STATE = [];

/* eslint-disable-next-line default-param-last */
const toastReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return [...state, action.payload];
    case REMOVE_TOAST:
      return state.filter((toast) => toast.id !== action.payload.id);
    default:
      return state;
  }
};

export default toastReducer;
