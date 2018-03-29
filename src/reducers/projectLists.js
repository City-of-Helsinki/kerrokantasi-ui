import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const emptyProject = {
  id: '',
  title: {},
  phases: []
};


export default handleActions({
  fetchProjects: (state, {payload: {hearingLanguages}}) =>
    updeep({
      isFetching: true,
      data: {
        0: hearingLanguages.reduce((accumulator, current) =>
          updeep({title: {[current]: ''}}, accumulator), emptyProject)
      }
    }, state),
  receiveProjects: (state, {payload: {data: {results}}}) =>
    updeep({
      isFetching: false,
      data: [state.data[0], ...results]
    }, state),
  receiveProjectsError: (state) => updeep({isFetching: false}, state),
  updateDefaultProject: (state, {payload: {languages}}) => updeep({
    data: {
      0: {
        title: updeep.constant(languages.reduce((accumulator, current) => updeep({[current]: ''}, accumulator), {}))
      }
    }
  }, state)
}, {
  isFetching: false,
  data: []
});
