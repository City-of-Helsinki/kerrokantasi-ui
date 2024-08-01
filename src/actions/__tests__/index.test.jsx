import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { createAction } from 'redux-actions';

import * as api from "../../api";
import * as actions from '../index';

jest.mock('../../api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    apiDelete: jest.fn(),
    getApiTokenFromStorage: jest.fn(() => 'dummykey'),
    getAllFromEndpoint: jest.fn(),
}));


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchHearingList', () => {
  let store;
  beforeEach(() => {
    store = mockStore({});
    jest.resetAllMocks();  // Clear all mocks before each test
  });

  it('dispatches BEGIN_FETCH_HEARING_LIST and RECEIVE_HEARING_LIST on successful fetch', async () => {
    const listId = 'list1';
    const endpoint = '/some/hearing/endpoint';
    const params = { param1: 'value1' };
    const mockData = { results: [{ id: 1, name: 'Hearing One' }] };
    api.get.mockResolvedValue({ json: () => Promise.resolve(mockData) });  // Mocking the API call

    const expectedActions = [
      createAction("beginFetchHearingList")({ listId, params }),
      createAction("receiveHearingList")({ listId, data: mockData })
    ];

    await store.dispatch(actions.fetchHearingList(listId, endpoint, params));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('dispatches BEGIN_FETCH_HEARING_LIST and catches errors correctly', async () => {
    const listId = 'list1';
    const endpoint = '/some/hearing/endpoint';
    const params = { param1: 'value1' };
    const error = new Error('An error occurred');
    api.get.mockRejectedValue(error);  // Mocking a failed API call

    const expectedActions = [
      createAction("beginFetchHearingList")({ listId, params })
    ];

    await store.dispatch(actions.fetchHearingList(listId, endpoint, params));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('fetchInitialHearingList', () => {
    let store;
    const listId = 'initialList';
    const endpoint = 'v1/hearing';
    const params = { limit: 10 };  // Example of default parameters for initial fetch

    beforeEach(() => {
      store = mockStore({});
      api.get.mockClear();
    });

    it('dispatches actions for initial hearing list fetch successfully', async () => {
      const mockHearingData = { data: [{ id: 1, title: 'Hearing One' }] };
      api.get.mockResolvedValue({ json: () => Promise.resolve(mockHearingData) });

      const expectedActions = [
        { type: 'beginFetchHearingList', payload: { listId, params } },
        { type: 'receiveHearingList', payload: { listId, data: mockHearingData } }
      ];

      await store.dispatch(actions.fetchInitialHearingList(listId, endpoint, params));
      expect(store.getActions()).toEqual(expectedActions);
      expect(api.get).toHaveBeenCalledWith(endpoint, expect.objectContaining(params));
    });

    it('handles errors during initial hearing list fetch', async () => {
      const error = new Error('Failed to fetch');
      api.get.mockRejectedValue(error);

      const expectedActions = [
        { type: 'beginFetchHearingList', payload: { listId, params } }
        // Assuming requestErrorHandler handles dispatching an error action
      ];

      await store.dispatch(actions.fetchInitialHearingList(listId, endpoint, params));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  describe('fetchProjects', () => {
    let store;

    beforeEach(() => {
      store = mockStore({});
      api.get.mockClear();  // Clear any previous mocking info
    });

    it('dispatches fetchProjects and receiveProjects when API call is successful', async () => {
      const mockProjectsData = { projects: [{ id: '1', name: 'Project One' }, { id: '2', name: 'Project Two' }] };
      api.get.mockResolvedValue({ json: () => Promise.resolve(mockProjectsData) });  // Mocking the API call

      const expectedActions = [
        { type: 'fetchProjects' },
        { type: 'receiveProjects', payload: { data: mockProjectsData } }
      ];

      await store.dispatch(actions.fetchProjects());
      expect(store.getActions()).toEqual(expectedActions);
      expect(api.get).toHaveBeenCalledWith('v1/project');
    });

    it('handles errors when fetching projects fails', async () => {
      const error = new Error('Network error');
      api.get.mockRejectedValue(error);  // Mocking a failed API call

      const expectedActions = [
        { type: 'fetchProjects' },
        { type: 'receiveProjectsError' }
      ];

      await store.dispatch(actions.fetchProjects());
      expect(store.getActions()).toEqual(expectedActions);
    });
});
describe('fetchUserComments', () => {
    let store;

    beforeEach(() => {
      store = mockStore({});
      api.get.mockClear();  // Clear any previous mocking info
    });

    it('dispatches beginFetchUserComments and receiveUserComments when API call is successful', async () => {
      const additionalParams = { limit: 5 };
      const mockCommentsData = { comments: [{ id: '1', content: 'Comment One' }, { id: '2', content: 'Comment Two' }] };
      const expectedParams = { created_by: 'me', ...additionalParams };
      api.get.mockResolvedValue({ json: () => Promise.resolve(mockCommentsData) });  // Mocking the API call

      const expectedActions = [
        { type: 'beginFetchUserComments' },
        { type: 'receiveUserComments', payload: { data: mockCommentsData } }
      ];

      await store.dispatch(actions.fetchUserComments(additionalParams));
      expect(store.getActions()).toEqual(expectedActions);
      expect(api.get).toHaveBeenCalledWith('v1/comment', expectedParams);
    });

    it('handles errors when fetching user comments fails', async () => {
      const additionalParams = { limit: 5 };
      const error = new Error('Network error');
      api.get.mockRejectedValue(error);  // Mocking a failed API call

      const expectedActions = [
        { type: 'beginFetchUserComments' },
        { type: 'receiveUserCommentsError' }
      ];

      await store.dispatch(actions.fetchUserComments(additionalParams));
      expect(store.getActions()).toEqual(expectedActions);
    });
});
describe('fetchMoreHearings', () => {
    let store;
    const listId = 'hearingsList';
    const mockNextUrl = 'http://api.example.com/v1/hearing/?page=2';

    beforeEach(() => {
      // Setting up the mock store with initial state that includes the next URL
      store = mockStore({
        hearingLists: {
          [listId]: {
            next: mockNextUrl
          }
        }
      });
      api.get.mockClear();
    });

    it('dispatches beginFetchHearingList and receiveMoreHearings when fetching more hearings successfully', async () => {
      const mockHearingsData = { results: [{ id: 3, title: 'Hearing Three' }, { id: 4, title: 'Hearing Four' }] };
      api.get.mockResolvedValue({ json: () => Promise.resolve(mockHearingsData) });

      const expectedActions = [
        { type: 'beginFetchHearingList', payload: { listId } },
        { type: 'receiveMoreHearings', payload: { listId, data: mockHearingsData } }
      ];

      await store.dispatch(actions.fetchMoreHearings(listId));
      expect(store.getActions()).toEqual(expectedActions);
      expect(api.get).toHaveBeenCalledWith('v1/hearing/', { page: "2"});
    });

    it('handles errors during fetching more hearings', async () => {
      const error = new Error('API request failed');
      api.get.mockRejectedValue(error);

      const expectedActions = [
        { type: 'beginFetchHearingList', payload: { listId } }
      ];

      await store.dispatch(actions.fetchMoreHearings(listId));
      expect(store.getActions()).toEqual(expectedActions);
    });
});
describe('postSectionComment', () => {
    let store;
    const hearingSlug = 'sample-slug';
    const sectionId = 'section1';
    const commentData = {
        text: "This is a sample comment",
        pluginData: {},
        authCode: "authcode123",
        geojson: null,
        label: null,
        images: [],
        answers: [],
        pinned: false,
        mapCommentText: ""
    };
    const commentReturned = {
        content: "This is a sample comment",
        plugin_data: {},
        authorization_code: "authcode123",
        geojson: null,
        label: null,
        images: [],
        answers: [],
        pinned: false,
        map_comment_text: ""
    }

    beforeEach(() => {
        store = mockStore({
            oidc: {
                user: {
                    profile: {
                        sub: 'testi'
                    }
                }
            }
        });
        api.post.mockClear();
    });

    it('dispatches postingComment and postedComment when posting a comment successfully', async () => {
      const mockResponse = {
        status: 200,
        json: () =>  Promise.resolve({ id: '123', status: 'created' }),
      }
      api.post.mockResolvedValue(mockResponse);

      const expectedActions = [
        createAction("postingComment")({ hearingSlug, sectionId }),
        createAction("postedComment")({ sectionId, jumpTo: '123' }),
        createAction("beginFetchHearing")({ hearingSlug }),
        createAction("fetchUserData")(),
      ];

      await store.dispatch(actions.postSectionComment(hearingSlug, sectionId, commentData));
      expect(store.getActions()).toEqual(expectedActions);
      expect(api.post).toHaveBeenCalledWith(`/v1/hearing/${hearingSlug}/sections/${sectionId}/comments/`, commentReturned);
    });

    it('handles errors when posting a comment fails', async () => {
        const error = {
            response: {
                status: 403
            },
            message: 'Forbidden'
        };
        api.post.mockRejectedValue(error);

        const expectedActions = [
            createAction("postingComment")({ hearingSlug, sectionId }),
        ];

        await store.dispatch(actions.postSectionComment(hearingSlug, sectionId, commentData));
        expect(store.getActions()).toEqual(expectedActions);
    });
});
describe('fetchLabels', () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
    });

    it('dispatches beginFetchLabels and receiveLabels when fetching labels successfully', async () => {
        const mockLabelsData = { results: [{ id: '1', name: 'Label One' }, { id: '2', name: 'Label Two' }], next: null };
        api.getAllFromEndpoint.mockResolvedValue(mockLabelsData);  // Ensure that the mock returns only the results part

        const expectedActions = [
            createAction('beginFetchLabels')(),
            createAction('receiveLabels')({ data: mockLabelsData })
        ];

        await store.dispatch(actions.fetchLabels());
        expect(store.getActions()).toEqual(expectedActions);  // Ensure actions are correctly created
        expect(api.getAllFromEndpoint).toHaveBeenCalledWith('/v1/label/');
    });
});
