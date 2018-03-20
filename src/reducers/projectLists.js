import updeep from 'updeep';
import {handleActions} from 'redux-actions';
import mockProjects from './hearingEditor/mock-projects';

const emptyProject = {
  id: '',
  title: {
    en: 'Default project'
  },
  phases: []
};

export default handleActions({
  fetchProjects: (state) => updeep({isFetching: true}, state),
  receiveProjects: (state, {payload: {projects}}) =>
    updeep({
      isFetching: false,
      data: projects
    }, state),
  receiveProjectsError: (state) => updeep({isFetching: false}, state),
}, {
  isFetching: false,
  data: [emptyProject, ...mockProjects]
});
