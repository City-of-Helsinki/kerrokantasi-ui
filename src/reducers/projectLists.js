import updeep from 'updeep';
import {handleActions} from 'redux-actions';

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
  data: []
});
