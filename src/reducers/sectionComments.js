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

const postedComment = (state, {payload: {sectionId, jumpTo}}) => {
  // whenever we post, we want the newly posted comment displayed first and results reloaded
  return updeep({
    [sectionId]: {
      jumpTo,
      results: [],
      ordering: '-created_at'
    }
  }, state);
};

/**
 * When comment is edited, no need to fetch the entire list again.
 * Update the object in array.
 */
const editedComment = (state, {payload: {sectionId, comment}}) => {
  const isSubComment = comment.comment; // A number usually represents the parent comment.
  if (isSubComment) {
    const commentIndex = state[sectionId].results.findIndex((sectionComment) => sectionComment.id === isSubComment);
    const subCommentIndex = state[sectionId].results[commentIndex].subComments.findIndex(
      (subComment) => subComment.id === comment.id);
    return updeep({
      [sectionId]: {
        results: {
          [commentIndex]: {
            subComments: {
              [subCommentIndex]: {
                ...comment,
              }
            }
          }
        }
      }
    }, state);
  }

  const commentIndex = state[sectionId].results.findIndex(
    (sectionComment) => { return sectionComment.id === comment.id; });
  return updeep({
    [sectionId]: {
      results: {
        [commentIndex]: {
          ...comment,
        }
      }
    }
  }, state);
};

const postedCommentVote = (state, {payload: {commentId, sectionId, isReply, parentId}}) => {
  // Save voted comment id to localstorage to prevent voting the same comment multiple times for non-authenticated users
  const votedComments = JSON.parse(localStorage.getItem("votedComments")) || [];
  localStorage.setItem("votedComments", JSON.stringify([commentId, ...votedComments]));

  // the vote went through
  const increment = (votes) => { return votes + 1; };
  if (isReply) {
    const commentIndex = state[sectionId].results.findIndex((comment) => comment.id === parentId);
    const subComponentIndex = state[sectionId].results[commentIndex].subComments
      .findIndex((subComment) => subComment.id === commentId);
    return updeep({
      [sectionId]: {
        results: {
          [commentIndex]: {
            subComments: {
              [subComponentIndex]: {
                n_votes: increment,
              }
            }
          }
        }
      }
    }, state);
  }
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

const postedCommentFlag = (state, {payload: {commentId, sectionId, isReply, parentId}}) => {
  // the flagging went through
  if (isReply) {
    const commentIndex = state[sectionId].results.findIndex((comment) => comment.id === parentId);
    const subComponentIndex = state[sectionId].results[commentIndex].subComments
      .findIndex((subComment) => subComment.id === commentId);
    return updeep({
      [sectionId]: {
        results: {
          [commentIndex]: {
            subComments: {
              [subComponentIndex]: {
                flagged: true,
              }
            }
          }
        }
      }
    }, state);
  }
  const commentIndex = state[sectionId].results.findIndex((comment) => { return comment.id === commentId; });
  return updeep({
    [sectionId]: {
      results: {
        [commentIndex]: {
          flagged: true
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

/**
 * Begin fetching the sub comments.
 * Show loading spinner on the parent comment description.
 */
const beginFetchSubComments = (state, {payload: {sectionId, commentId}}) => {
  const updatedSection = {
    ...state[sectionId],
    results: [
      ...state[sectionId].results.map((result) => {
        if (result.id === commentId) {
          return { ...result, loadingSubComments: true };
        }
        return result;
      }),
    ]
  };
  return updeep({
    [sectionId]: updatedSection,
  }, state);
};

/**
 * Once comments are fetched, update the store with sub comments.
 */
const subCommentsFetched = (state, {payload: {sectionId, commentId, data, jumpTo}}) => {
  const updatedSection = {
    ...state[sectionId],
    jumpTo,
    results: [
      ...state[sectionId].results.map((result) => {
        if (result.id === commentId) {
          return {
            ...result,
            loadingSubComments: false,
            subComments: data.results
          };
        }
        return result;
      })
    ]
  };
  return updeep({
    [sectionId]: updatedSection,
  }, state);
};

export default handleActions({
  beginFetchSectionComments,
  beginFetchSubComments,
  editedComment,
  postedComment,
  postedCommentVote,
  postedCommentFlag,
  receiveSectionComments,
  subCommentsFetched,
}, {});
