// @flow
import {combineReducers} from 'redux';
import {combineActions, handleActions} from 'redux-actions';
import {head} from 'lodash';

import {EditorActions} from '../../actions/hearingEditor';

// const getNormalizedHearing = (rawHearing) => {
//   const normalizedHearing = normalize(rawHearing, hearingSchema);
//   return normalizedHearing.entities.hearing[rawHearing.id];
// };

const data = handleActions({
  [EditorActions.RECEIVE_HEARING]: (state, {payload: {result, entities}}) => entities.hearing[result],
  [EditorActions.BEGIN_EDIT_HEARING]: (state, {payload}) => (
    payload.hearing
  ),
  // Weird way of getting the normalized hearing when the hearing actually was normalized without any identifier
  [EditorActions.INIT_NEW_HEARING]: (state, {payload: {entities}}) => entities.hearing[head(Object.keys(entities.hearing))],
  [EditorActions.EDIT_HEARING]: (state, {payload: {field, value}}) => {
    return Object.assign({}, state, {[field]: value});
  },
  [EditorActions.ADD_SECTION]: (state, {payload: {section}}) => ({
    ...state,
    sections: [...state.sections, section.frontId]
  }),
  [EditorActions.REMOVE_SECTION]: (state, {payload: {sectionID}}) => ({
    ...state,
    sections: state.sections.filter((id) => id !== sectionID)
  }),
  [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, {payload: {result, entities}}) => ({
    ...state,
    ...entities.hearing[result],
  }),
}, null);

const isFetching = handleActions({
  [combineActions('beginFetchHearing')]: () => true,
  [combineActions('receiveHearing')]: () => false,
}, false);

const reducer = combineReducers({
  data,
  isFetching,
});

export default reducer;
