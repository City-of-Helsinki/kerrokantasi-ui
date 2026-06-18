import { configureStore } from '@reduxjs/toolkit';

import sectionComments from '../sectionComments';

const SECTION_ID = 'section-1';

const makeComment = (overrides = {}) => ({
  id: 1,
  content: 'Hello',
  n_votes: 0,
  flagged: false,
  subComments: [],
  comments: [],
  ...overrides,
});

const makeStore = (preloadedState = {}) =>
  configureStore({ reducer: sectionComments, preloadedState });

describe('sectionComments reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns existing state for unknown action', () => {
    const store = makeStore({ [SECTION_ID]: { results: [], count: 0 } });
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    expect(store.getState()[SECTION_ID]).toEqual({ results: [], count: 0 });
  });

  describe('receiveSectionComments', () => {
    it('sets results from paginated payload when no prior state exists', () => {
      const store = makeStore();
      const results = [makeComment({ id: 1 }), makeComment({ id: 2 })];
      store.dispatch({
        type: 'receiveSectionComments',
        payload: {
          sectionId: SECTION_ID,
          data: { count: 2, results, next: null },
        },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.isFetching).toBe(false);
      expect(state.count).toBe(2);
      expect(state.next).toBeNull();
      expect(state.results).toHaveLength(0); // no prior state → combinedResults is []
    });

    it('appends paginated results to existing results', () => {
      const existing = [makeComment({ id: 1 })];
      const store = makeStore({
        [SECTION_ID]: { results: existing, count: 1, isFetching: true },
      });
      const incoming = [makeComment({ id: 2 }), makeComment({ id: 3 })];
      store.dispatch({
        type: 'receiveSectionComments',
        payload: {
          sectionId: SECTION_ID,
          data: { count: 3, results: incoming, next: 'https://next-page' },
        },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.isFetching).toBe(false);
      expect(state.count).toBe(3);
      expect(state.next).toBe('https://next-page');
      expect(state.results).toHaveLength(3);
      expect(state.results[0].id).toBe(1);
      expect(state.results[1].id).toBe(2);
    });

    it('replaces results when payload is a flat array', () => {
      const prior = [makeComment({ id: 99 })];
      const store = makeStore({ [SECTION_ID]: { results: prior, count: 1 } });
      const flat = [makeComment({ id: 10 }), makeComment({ id: 11 })];
      store.dispatch({
        type: 'receiveSectionComments',
        payload: { sectionId: SECTION_ID, data: flat },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.isFetching).toBe(false);
      expect(state.count).toBe(2);
      expect(state.next).toBeNull();
      expect(state.results).toEqual(flat);
    });
  });

  describe('beginFetchSectionComments', () => {
    it('preserves results when ordering matches and cleanFetch is false', () => {
      const results = [makeComment()];
      const store = makeStore({
        [SECTION_ID]: { results, ordering: '-created_at', isFetching: false },
      });
      store.dispatch({
        type: 'beginFetchSectionComments',
        payload: {
          sectionId: SECTION_ID,
          ordering: '-created_at',
          cleanFetch: false,
        },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.isFetching).toBe(true);
      expect(state.results).toEqual(results);
      expect(state.ordering).toBe('-created_at');
    });

    it('clears results when ordering differs', () => {
      const store = makeStore({
        [SECTION_ID]: {
          results: [makeComment()],
          ordering: '-created_at',
          isFetching: false,
        },
      });
      store.dispatch({
        type: 'beginFetchSectionComments',
        payload: {
          sectionId: SECTION_ID,
          ordering: 'created_at',
          cleanFetch: false,
        },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.isFetching).toBe(true);
      expect(state.results).toEqual([]);
      expect(state.ordering).toBe('created_at');
    });

    it('clears results when cleanFetch is true regardless of ordering', () => {
      const store = makeStore({
        [SECTION_ID]: {
          results: [makeComment()],
          ordering: '-created_at',
          isFetching: false,
        },
      });
      store.dispatch({
        type: 'beginFetchSectionComments',
        payload: {
          sectionId: SECTION_ID,
          ordering: '-created_at',
          cleanFetch: true,
        },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.isFetching).toBe(true);
      expect(state.results).toEqual([]);
    });
  });

  describe('postedComment', () => {
    it('resets results, sets jumpTo and ordering', () => {
      const store = makeStore({
        [SECTION_ID]: {
          results: [makeComment()],
          count: 1,
          ordering: 'created_at',
        },
      });
      store.dispatch({
        type: 'postedComment',
        payload: { sectionId: SECTION_ID, jumpTo: 42 },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.results).toEqual([]);
      expect(state.jumpTo).toBe(42);
      expect(state.ordering).toBe('-created_at');
    });
  });

  describe('editedComment', () => {
    it('updates a top-level comment in-place', () => {
      const comments = [
        makeComment({ id: 1, content: 'Original' }),
        makeComment({ id: 2 }),
      ];
      const store = makeStore({ [SECTION_ID]: { results: comments } });
      store.dispatch({
        type: 'editedComment',
        payload: {
          sectionId: SECTION_ID,
          comment: { id: 1, content: 'Updated' },
        },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.results[0].content).toBe('Updated');
      expect(state.results[1].id).toBe(2);
    });
  });

  describe('postedCommentVote', () => {
    it('increments n_votes on the target comment', () => {
      const comments = [
        makeComment({ id: 1, n_votes: 3 }),
        makeComment({ id: 2, n_votes: 0 }),
      ];
      const store = makeStore({ [SECTION_ID]: { results: comments } });
      store.dispatch({
        type: 'postedCommentVote',
        payload: { commentId: 1, sectionId: SECTION_ID, isReply: false },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.results[0].n_votes).toBe(4);
      expect(state.results[1].n_votes).toBe(0);
    });

    it('persists voted comment id to localStorage', () => {
      const store = makeStore({
        [SECTION_ID]: { results: [makeComment({ id: 7 })] },
      });
      store.dispatch({
        type: 'postedCommentVote',
        payload: { commentId: 7, sectionId: SECTION_ID, isReply: false },
      });
      const stored = JSON.parse(localStorage.getItem('votedComments'));
      expect(stored).toContain(7);
    });
  });

  describe('postedCommentFlag', () => {
    it('sets flagged to true on the target comment', () => {
      const comments = [
        makeComment({ id: 1, flagged: false }),
        makeComment({ id: 2, flagged: false }),
      ];
      const store = makeStore({ [SECTION_ID]: { results: comments } });
      store.dispatch({
        type: 'postedCommentFlag',
        payload: { commentId: 1, sectionId: SECTION_ID, isReply: false },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.results[0].flagged).toBe(true);
      expect(state.results[1].flagged).toBe(false);
    });
  });

  describe('receiveSectionCommentsError', () => {
    it('sets isFetching to false', () => {
      const store = makeStore({
        [SECTION_ID]: { isFetching: true, results: [makeComment()] },
      });
      store.dispatch({
        type: 'receiveSectionCommentsError',
        payload: { sectionId: SECTION_ID },
      });
      const state = store.getState()[SECTION_ID];
      expect(state.isFetching).toBe(false);
      expect(state.results).toHaveLength(1);
    });
  });
});
