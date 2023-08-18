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

const postedComment = (state, {payload: {sectionId, jumpTo}}) => 
  // whenever we post, we want the newly posted comment displayed first and results reloaded
   updeep({
    [sectionId]: {
      jumpTo,
      results: [],
      ordering: '-created_at'
    }
  }, state)
;

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
    (sectionComment) => sectionComment.id === comment.id);
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
  const increment = (votes) => votes + 1;
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
    (comment) => comment.id === commentId);
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
  const commentIndex = state[sectionId].results.findIndex((comment) => comment.id === commentId);
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
 * Returns an array consisting of the path to the comment that is to be updated.
 * Returns false if for some reason the targetId comment was not found anywhere.
 *
 * This also works for targetId comments that are replies to a reply if that functionality is needed in the future.
 * @param {Object} root the root object.
 * @param {Object} current object that is checked if it's the one that should be updated.
 * @param {string} targetId id of the comment that we are searching for that is to be updated.
 * @param {string[]} [initialPath=[]] optional array that's spread into the final path array, ['results',...initialPath]
 * @returns {string[]|boolean}
 */
const recursiveSearch = (root, current, targetId, initialPath = []) => {
  const finalPath = ['results', ...initialPath];
  // current is the same as the root
  if (current.results) {
    // pushes index of the target, if -1 is pushed that means that the target comment is a reply of a reply.
    finalPath.push(current.results.findIndex(element => element.id === targetId));
    return finalPath;
  } if (current.comments.includes(targetId)) {
    // This part is used to figure out the path to a comment that is a reply to a reply.
    finalPath.push(root.results.indexOf(current));
    // loop through subComments and push the final parts of the path once we find the comment.
    current.subComments.findIndex((comment, index) => {
      if (comment.id === targetId) {
        finalPath.push('subComments', index);
        return true;
      }
      return false;
    });
    return finalPath;
  }
  // This shouldn't happen but return false if for some reason targetId wasn't found anywhere.
  return false;
};

/**
 * Loops through results and returns array consisting of the path to the root comment reply that was replied to.
 * @see recursiveSearch
 * @example
 * root comment
 * - reply to root
 * -- reply to reply <- targetId
 * @param {Object} root the root object.
 * @param {Object []} results same as the root params results key.
 * @param {string} targetId id of the comment that we are searching for that is to be updated.
 * @returns {string|string[]}
 */
const replySearch = (root, results = [], targetId) => {
  let pathToReply = '';
  // loop through root comments until we find which root comment reply was replied to.
  for (let index = 0; index < results.length; index += 1) {
    if (root.results[index].comments.includes(targetId)) {
      pathToReply = recursiveSearch(root, root.results[index], targetId);
      break;
    }
  }
  return pathToReply;
};

/**
 * Begin fetching the sub comments.
 * Show loading spinner on the parent comment description.
 */
const beginFetchSubComments = (state, {payload: {sectionId, commentId}}) => {
  let updatedState = {...state[sectionId]};

  // Array consisting of the path to commentId comment.
  let updatePath = recursiveSearch(updatedState, updatedState, commentId);
  if (!updatePath) {
    // If for some reason updatePath is false -> return state.
    return state;
  }

  if (updatePath[1] === -1) {
    // commentId comment was not a reply to a root comment -> it was a reply to a reply.
    updatePath = replySearch(updatedState, updatedState.results, commentId);
  }
  // push the name of the variable that we want to toggle.
  updatePath.push('loadingSubComments');

  /**
   * updates the value at updatePath in updatedState to true.
   * @example
   * pathArray = ['results',1,'loadingSubComments']
   * updateState = {results:[{...}, {loadingSubComments: false}]}
   * updateState = updateIn(pathArray, true, updateState)
   * updateState === {results:[{...}, {loadingSubComments: true}]}
   */
  updatedState = updeep.updateIn(updatePath, true, updatedState);

  return updeep({
    [sectionId]: updatedState,
  }, state);
};

/**
 * Once comments are fetched, update the store with sub comments.
 */
const subCommentsFetched = (state, {payload: {sectionId, commentId, data, jumpTo}}) => {
  let updatedState = {...state[sectionId], jumpTo};

  // Array consisting of the path to commentId comment for which we fetched comments.
  let updatePath = recursiveSearch(updatedState, updatedState, commentId);
  if (!updatePath) {
    // If for some reason updatePath is false -> return state.
    return state;
  }

  if (updatePath[1] === -1) {
    // commentId comment was not a reply to a root comment -> it was a reply to a reply.
    updatePath = replySearch(updatedState, updatedState.results, commentId);
  }

  /**
   * updates the value at updatePath in updatedState.
   * @example
   * pathArray = ['results',1]
   * data = {results: [{...},{...}]}
   * updateState = {results:[{...}, {loadingSubComments: true}]}
   * updateState = updateIn([...pathArray, 'loadingSubComments'], false, updateState)
   * updateState === {results:[{...}, {loadingSubComments: false}]}
   * updateState = updateIn([...pathArray, 'subComments'], data.results, updateState)
   * updateState === {results:[{...}, {loadingSubComments: false, subComments: [{...},{...}]}]}
   */
  updatedState = updeep.updateIn([...updatePath, 'loadingSubComments'], false, updatedState);
  updatedState = updeep.updateIn([...updatePath, 'subComments'], data.results, updatedState);

  return updeep({
    [sectionId]: updatedState,
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
