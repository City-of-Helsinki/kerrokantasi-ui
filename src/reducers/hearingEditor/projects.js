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
