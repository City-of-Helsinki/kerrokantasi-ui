import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const receiveSectionComments = (state, {payload: {sectionId, data}}) => {
  const combinedResults = state[sectionId] ? [...(state[sectionId].results), ...data.results] : [];
  return updeep({
    [sectionId]: {
      isFetching: false,
      ...data,
      results: combinedResults
    }
  }, state);
};

const beginFetchSectionComments = (state, {payload: {sectionId, ordering}}) => {
  if (state[sectionId] && state[sectionId].ordering === ordering) {
    return updeep({
      [sectionId]: {
        isFetching: true
      }
    }, state);
  }
  return ({
    [sectionId]: {
      isFetching: true,
      results: [],
      ordering
    }
  });
};

export default handleActions({
  receiveSectionComments,
  beginFetchSectionComments
}, {});
