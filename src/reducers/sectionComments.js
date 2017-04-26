import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const receiveSectionComments = (state, {payload: {sectionId, data}}) => {
  // we must accept flattened as well as paginated comment listings
  let combinedResults = [];
  if ('results' in data) {
    combinedResults = state[sectionId] ? [...state[sectionId].results, ...data.results] : [];
  } else {
    combinedResults = data;
  }
  return updeep({
    [sectionId]: {
      isFetching: false,
      ...data,
      results: combinedResults
    }
  }, state);
};

const beginFetchSectionComments = (state, {payload: {sectionId, ordering, cleanFetch}}) => {
  if (state[sectionId] && state[sectionId].ordering === ordering && !cleanFetch) {
    return updeep({
      [sectionId]: {
        isFetching: true,
      }
    }, state);
  }
  return updeep({
    [sectionId]: {
      isFetching: true,
      results: [],
      ordering
    }
  }, state);
};

export default handleActions({
  receiveSectionComments,
  beginFetchSectionComments
}, {});
