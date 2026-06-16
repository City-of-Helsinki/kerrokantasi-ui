import { createReducer } from '@reduxjs/toolkit';

/** Immutably set a value at a nested path in an object/array. */
const setIn = (obj, [key, ...rest], value) => {
  if (rest.length === 0) {
    return Array.isArray(obj)
      ? obj.map((item, i) => (i === key ? value : item))
      : { ...obj, [key]: value };
  }
  const child = setIn(obj[key], rest, value);
  return Array.isArray(obj)
    ? obj.map((item, i) => (i === key ? child : item))
    : { ...obj, [key]: child };
};

const receiveSectionComments = (state, { payload: { sectionId, data } }) => {
  // we must accept flattened as well as paginated comment listings
  let combinedResults = [];
  let count = 0;
  let next = null;
  if (Array.isArray(data)) {
    combinedResults = data;
    count = data.length;
  } else {
    combinedResults = state[sectionId]
      ? [...state[sectionId].results, ...data.results]
      : [];
    count = data.count;
    next = data.next;
  }

  return {
    ...state,
    [sectionId]: { ...state[sectionId], isFetching: false, results: combinedResults, count, next },
  };
};

const postedComment = (state, { payload: { sectionId, jumpTo } }) => ({
  // whenever we post, we want the newly posted comment displayed first and results reloaded
  ...state,
  [sectionId]: { ...state[sectionId], jumpTo, results: [], ordering: '-created_at' },
});

/**
 * When comment is edited, no need to fetch the entire list again.
 * Update the object in array.
 */
const editedComment = (state, { payload: { sectionId, comment } }) => {
  const isSubComment = comment.comment; // A number usually represents the parent comment.
  const sectionState = state[sectionId];
  if (isSubComment) {
    const commentIndex = sectionState.results.findIndex(
      (sectionComment) => sectionComment.id === isSubComment
    );
    const subCommentIndex = sectionState.results[commentIndex].subComments.findIndex(
      (subComment) => subComment.id === comment.id
    );
    return {
      ...state,
      [sectionId]: {
        ...sectionState,
        results: sectionState.results.map((c, ci) =>
          ci !== commentIndex
            ? c
            : {
                ...c,
                subComments: c.subComments.map((sc, si) =>
                  si === subCommentIndex ? { ...sc, ...comment } : sc
                ),
              }
        ),
      },
    };
  }

  const commentIndex = sectionState.results.findIndex(
    (sectionComment) => sectionComment.id === comment.id
  );
  return {
    ...state,
    [sectionId]: {
      ...sectionState,
      results: sectionState.results.map((c, i) =>
        i === commentIndex ? { ...c, ...comment } : c
      ),
    },
  };
};

const postedCommentVote = (
  state,
  { payload: { commentId, sectionId, isReply, parentId } }
) => {
  // Save voted comment id to localstorage to prevent voting the same comment multiple times for non-authenticated users
  const votedComments = JSON.parse(localStorage.getItem('votedComments')) || [];
  localStorage.setItem(
    'votedComments',
    JSON.stringify([commentId, ...votedComments])
  );

  const sectionState = state[sectionId];
  // the vote went through
  if (isReply) {
    const commentIndex = sectionState.results.findIndex(
      (comment) => comment.id === parentId
    );
    const subComponentIndex = sectionState.results[commentIndex].subComments.findIndex(
      (subComment) => subComment.id === commentId
    );
    return {
      ...state,
      [sectionId]: {
        ...sectionState,
        results: sectionState.results.map((c, ci) =>
          ci !== commentIndex
            ? c
            : {
                ...c,
                subComments: c.subComments.map((sc, si) =>
                  si === subComponentIndex
                    ? { ...sc, n_votes: sc.n_votes + 1 }
                    : sc
                ),
              }
        ),
      },
    };
  }
  const commentIndex = sectionState.results.findIndex(
    (comment) => comment.id === commentId
  );
  return {
    ...state,
    [sectionId]: {
      ...sectionState,
      results: sectionState.results.map((c, i) =>
        i === commentIndex ? { ...c, n_votes: c.n_votes + 1 } : c
      ),
    },
  };
};

const postedCommentFlag = (
  state,
  { payload: { commentId, sectionId, isReply, parentId } }
) => {
  const sectionState = state[sectionId];
  // the flagging went through
  if (isReply) {
    const commentIndex = sectionState.results.findIndex(
      (comment) => comment.id === parentId
    );
    const subComponentIndex = sectionState.results[commentIndex].subComments.findIndex(
      (subComment) => subComment.id === commentId
    );
    return {
      ...state,
      [sectionId]: {
        ...sectionState,
        results: sectionState.results.map((c, ci) =>
          ci !== commentIndex
            ? c
            : {
                ...c,
                subComments: c.subComments.map((sc, si) =>
                  si === subComponentIndex ? { ...sc, flagged: true } : sc
                ),
              }
        ),
      },
    };
  }
  const commentIndex = sectionState.results.findIndex(
    (comment) => comment.id === commentId
  );
  return {
    ...state,
    [sectionId]: {
      ...sectionState,
      results: sectionState.results.map((c, i) =>
        i === commentIndex ? { ...c, flagged: true } : c
      ),
    },
  };
};

const beginFetchSectionComments = (
  state,
  { payload: { sectionId, ordering, cleanFetch } }
) => {
  if (state[sectionId] && state[sectionId].ordering === ordering && !cleanFetch) {
    return { ...state, [sectionId]: { ...state[sectionId], isFetching: true } };
  }
  return {
    ...state,
    [sectionId]: { ...state[sectionId], isFetching: true, results: [], ordering },
  };
};

const receiveSectionCommentsError = (state, { payload: { sectionId } }) => ({
  ...state,
  [sectionId]: { ...state[sectionId], isFetching: false },
});

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
    finalPath.push(
      current.results.findIndex((element) => element.id === targetId)
    );
    return finalPath;
  }

  if (current.comments.includes(targetId)) {
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
const replySearch = (root, targetId, results = []) => {
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
const beginFetchSubComments = (
  state,
  { payload: { sectionId, commentId } }
) => {
  let updatedState = { ...state[sectionId] };

  // Array consisting of the path to commentId comment.
  let updatePath = recursiveSearch(updatedState, updatedState, commentId);
  if (!updatePath) {
    // If for some reason updatePath is false -> return state.
    return state;
  }

  if (updatePath[1] === -1) {
    // commentId comment was not a reply to a root comment -> it was a reply to a reply.
    updatePath = replySearch(updatedState, commentId, updatedState.results);
  }
  // push the name of the variable that we want to toggle.
  updatePath.push('loadingSubComments');

  /**
   * updates the value at updatePath in updatedState to true.
   * @example
   * pathArray = ['results',1,'loadingSubComments']
   * updateState = {results:[{...}, {loadingSubComments: false}]}
   * updateState = setIn(updateState, pathArray, true)
   * updateState === {results:[{...}, {loadingSubComments: true}]}
   */
  updatedState = setIn(updatedState, updatePath, true);

  return { ...state, [sectionId]: updatedState };
};

/**
 * Once comments are fetched, update the store with sub comments.
 */
const subCommentsFetched = (
  state,
  { payload: { sectionId, commentId, data, jumpTo } }
) => {
  let updatedState = { ...state[sectionId], jumpTo };

  // Array consisting of the path to commentId comment for which we fetched comments.
  let updatePath = recursiveSearch(updatedState, updatedState, commentId);
  if (!updatePath) {
    // If for some reason updatePath is false -> return state.
    return state;
  }

  if (updatePath[1] === -1) {
    // commentId comment was not a reply to a root comment -> it was a reply to a reply.
    updatePath = replySearch(updatedState, commentId, updatedState.results);
  }

  /**
   * updates the value at updatePath in updatedState.
   * @example
   * pathArray = ['results',1]
   * data = {results: [{...},{...}]}
   * updateState = {results:[{...}, {loadingSubComments: true}]}
   * updateState = setIn(updateState, [...pathArray, 'loadingSubComments'], false)
   * updateState === {results:[{...}, {loadingSubComments: false}]}
   * updateState = setIn(updateState, [...pathArray, 'subComments'], data.results)
   * updateState === {results:[{...}, {loadingSubComments: false, subComments: [{...},{...}]}]}
   */
  updatedState = setIn(updatedState, [...updatePath, 'loadingSubComments'], false);
  updatedState = setIn(updatedState, [...updatePath, 'subComments'], data.results);

  return { ...state, [sectionId]: updatedState };
};

export default createReducer({}, (builder) => {
  builder
    .addCase('beginFetchSectionComments', beginFetchSectionComments)
    .addCase('beginFetchSubComments', beginFetchSubComments)
    .addCase('editedComment', editedComment)
    .addCase('postedComment', postedComment)
    .addCase('postedCommentVote', postedCommentVote)
    .addCase('postedCommentFlag', postedCommentFlag)
    .addCase('receiveSectionComments', receiveSectionComments)
    .addCase('receiveSectionCommentsError', receiveSectionCommentsError)
    .addCase('subCommentsFetched', subCommentsFetched);
});
