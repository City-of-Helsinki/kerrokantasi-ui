// @flow
import {combineReducers} from 'redux';
import {combineActions, handleActions} from 'redux-actions';

import {EditorActions} from '../../actions/hearingEditor';
import {initNewHearing} from '../../utils/hearing';

// const getNormalizedHearing = (rawHearing) => {
//   const normalizedHearing = normalize(rawHearing, hearingSchema);
//   return normalizedHearing.entities.hearing[rawHearing.id];
// };

const data = handleActions({
  [combineActions(
    EditorActions.RECEIVE_HEARING,
    EditorActions.POST_HEARING_SUCCESS,
    EditorActions.SAVE_HEARING_SUCCESS,
  )]: (state, {payload: {result, entities}}) => entities.hearing[result],
  [EditorActions.BEGIN_EDIT_HEARING]: (state, {payload}) => (
    payload.hearing
  ),
  [EditorActions.INIT_NEW_HEARING]: () => (initNewHearing()),
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
  [EditorActions.POST_HEARING_SUCCESS]: (state, {payload: {hearing}}) => hearing,
  [EditorActions.SAVE_HEARING_SUCCESS]: (state, {payload: {hearing}}) => hearing,
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
