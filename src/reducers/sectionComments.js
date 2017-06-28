import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const receiveSectionComments = (state, {payload: {sectionId, data}}) => {
  // we must accept flattened as well as paginated comment listings
  let combinedResults = [];
  let count = 0;
  let next = null;
  if (Array.isArray(data)) {
    combinedResults = data;
    count = data.length;
  } else {
    combinedResults = state[sectionId] ? [...state[sectionId].results, ...data.results] : [];
    count = data.count;
    next = data.next;
  }
  // if ('results' in data) {
  //   combinedResults = state[sectionId] ? [...state[sectionId].results, ...data.results] : [];
  // } else {
  //   combinedResults = data;
  // }
  return updeep({
    [sectionId]: {
      isFetching: false,
      results: combinedResults,
      count,
      next
    }
  }, state);
};

const postedComment = (state, {payload: {sectionId}}) => {
  // whenever we post, we want the newly posted comment displayed first and results reloaded
  return updeep({
    [sectionId]: {
      results: [],
      ordering: '-created_at'
    }
  }, state);
};

const postedCommentVote = (state, {payload: {commentId, sectionId}}) => {
  // the vote went through
  const increment = (votes) => { return votes + 1; };
  const commentIndex = state[sectionId].results.findIndex(
    (comment) => { return comment.id === commentId; });
  return updeep({
    [sectionId]: {
      results: {
        [commentIndex]: {
          n_votes: increment
        }
      }
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
  beginFetchSectionComments,
  postedComment,
  postedCommentVote,
}, {});
