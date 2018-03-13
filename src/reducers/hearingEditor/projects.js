import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {EditorActions} from '../../actions/hearingEditor';
import mockProjects from './mock-projects';

const projects = handleActions({
  [EditorActions.FETCH_PROJECTS]: () => addEmptyProject(mockProjects),
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
        const newPhases = project.phases.map(phase => {
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
        return Object.assign({}, project, {
          phases: newPhases
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
}, addEmptyProject(mockProjects));

// const shallowProjects = handleActions(
//   {
//     [EditorActions.FETCH_PROJECTS]: () =>
//       addEmptyProject(mockProjects).map(project => {
//         const {id, title, identifier} = project;
//         return {
//           id, title, identifier
//         };
//       }),
//   },
//   []
// );
//
// const phasesByProjectId = handleActions(
//   {
//     [EditorActions.ADD_PHASE]: (state, {payload: {phaseInfo, projectId}}) =>
//       Object.assign({}, state, {
//         [projectId]: [...state[projectId], phaseInfo]
//       }),
//     [EditorActions.DELETE_PHASE]: (state, {payload: {projectId, phaseId}}) =>
//       Object.assign({}, state, {
//         [projectId]: state[projectId].filter(phase => phase.id !== phaseId)
//       }),
//     [EditorActions.EDIT_PHASE]: (state, {payload: {
//       phaseId,
//       projectId,
//       fieldName,
//       language,
//       value
//     }}) =>
//       ({
//         ...state,
//         [projectId]: state[projectId].map(phase => {
//           if (phase.id === phaseId) {
//             return {
//               ...phase,
//               [fieldName]: {...phase[fieldName], [language]: value}
//             };
//           }
//           return phase;
//         })
//       })
//   },
//   addEmptyProject(mockProjects).reduce((accumulator, currentProject) => {
//     return Object.assign({}, accumulator, {
//       [currentProject.id]: currentProject.phases
//     });
//   }, {})
// );

function addEmptyProject(projectsList) {
  return [
    {
      id: '',
      phases: []
    },
    ...projectsList
  ];
}

// const reducer = combineReducers({
//   // projects,
//   phasesByProjectId,
//   shallowProjects
// });

export default projects;
