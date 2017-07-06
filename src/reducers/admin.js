import {handleActions} from 'redux-actions';
import {cloneDeep} from 'lodash';

import {AdminActions} from '../actions/admin';

const adminReducer = handleActions({
  [AdminActions.ADD_CONTACT]: (state, {payload: {contact}}) => {
    const newState = cloneDeep(state);
    console.log(newState);
    newState.sections.push(contact);
    return Object.assign({}, newState);
  },
  [AdminActions.ADD_CONTACT_FAILED]: (state, {payload}) =>
    payload.errors,
  [AdminActions.ADD_CONTACT_SUCCESS]: () => null
}, {});

export default adminReducer;
