import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import * as api from "../../api";
import * as actions from '../index';
import { createAction } from 'redux-actions';

jest.mock('../../api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    apiDelete: jest.fn(),
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


