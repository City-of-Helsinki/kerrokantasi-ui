import {handleActions} from 'redux-actions';
import {EditorActions} from '../../actions/hearingEditor';
import mockProjects from './mock-projects';

// const projects = (state) => {
//   return state || mockProjects;
// };

const projects = handleActions({
  [EditorActions.FETCH_PROJECTS]: () => mockProjects,
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
    })
}, []);

export default projects;
