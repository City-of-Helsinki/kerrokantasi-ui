import {handleActions} from 'redux-actions';
import {EditorActions} from '../../actions/hearingEditor';
import mockProjects from './mock-projects';

const projects = handleActions({
  [EditorActions.FETCH_PROJECTS]: () => [
    getEmptyProject(),
    ...mockProjects
  ],
  [EditorActions.DELETE_PHASE]: (state, {payload}) =>
    state.map(project => {
      if (project.id === payload.projectId) {
        return Object.assign({}, project, {
          phases: project.phases.filter(phase => phase.id !== payload.phaseId)
        });
      }
      return project;
    }),
  [EditorActions.EDIT_PHASE]: (state, {payload: {
    phaseId,
    projectId,
    fieldName,
    language,
    value
  }}) =>
    state.map(project => {
      if (project.id === projectId) {
        return project.phases.map(phase => {
          if (phase.id === phaseId) {
            const newValue = {
              [language]: value
            };
            return Object.assign({}, phase, {
              [fieldName]: newValue
            });
          }
          return phase;
        });
      }
      return project;
    }),
  [EditorActions.ADD_PHASE]: (state, {payload}) =>
    state.map(project => {
      if (project.id === payload.projectId) {
        return Object.assign({}, project, {
          phases: [...project.phases, payload.phaseInfo]
        });
      }
      return project;
    }),
  [EditorActions.CREATE_PROJECT]: (state, {payload}) =>
    [...state, payload]
}, [getEmptyProject()]);

function getEmptyProject() {
  return {
    id: '',
    phases: []
  };
}

export default projects;
