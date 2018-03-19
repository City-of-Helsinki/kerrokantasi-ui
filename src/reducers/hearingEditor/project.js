import {handleActions} from 'redux-actions';
import {EditorActions} from '../../actions/hearingEditor';
import updeep from 'updeep';

const project = handleActions({
  [EditorActions.DELETE_PHASE]: (state, {payload: {phaseId}}) =>
    updeep({
      phases: state.phases.filter(phase => phase.id !== phaseId)
    }, state),
  [EditorActions.EDIT_PHASE]: (state, {payload: {
    phaseId,
    fieldName,
    language,
    value
  }}) =>
    updeep({
      phases: state.phases.map(phase => {
        if (phase.id === phaseId) {
          return updeep({
            [fieldName]: {
              [language]: value
            }
          }, phase);
        }
        return phase;
      })
    }, state),
  [EditorActions.ADD_PHASE]: (state, {payload: {phaseInfo}}) =>
    updeep({
      phases: [...state.phases, phaseInfo]
    }, state)
}, {});

export default project;
