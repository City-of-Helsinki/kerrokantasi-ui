// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import {EditorActions} from '../../actions/hearingEditor';

const byId = handleActions({
  [EditorActions.RECEIVE_META_DATA]: (state, {payload: {contactPersons}}) => { console.log(contactPersons); return contactPersons.entities.contactPersons; }
}, {});

const all = handleActions({
  [EditorActions.RECEIVE_META_DATA]: (state, {payload: {contactPersons}}) => contactPersons.result.map(key => key.toString())
}, []);

const isFetching = handleActions({
  [EditorActions.FETCH_META_DATA]: () => true,
  [EditorActions.RECEIVE_META_DATA]: () => false,
  [EditorActions.ERROR_META_DATA]: () => false,
}, false);

const contactPersons = handleActions({
  [EditorActions.ADD_CONTACT]: () => true,
  [EditorActions.ADD_CONTACT_FAILED]: (state, {payload}) => payload.errors,
  [EditorActions.ADD_CONTACT_SUCCESS]: () => null
}, {});


export default combineReducers({
  byId,
  all,
  isFetching,
  contactPersons
});
