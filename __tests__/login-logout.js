import {createTestStore, mockFetch, jsonResponse} from '../test-utils';
import {login, logout} from '../src/actions';
import {replace} from '../src/mockable-fetch';
import {getUser} from '../src/selectors/user';

describe('Login/logout', () => {
  afterEach(() => {
    replace(null);
  });
  it("should be able to log in and out", () => {
    const fetcher = mockFetch({
      "/me": () => jsonResponse({
        id: '5ca1ab1e-cafe-babe-beef-deadbea70000',
        displayName: 'Mock von User',
        firstName: 'Mock',
        lastName: 'von User',
        username: 'mock.von.user',
        provider: 'helsinki',
      }),
      "/logout/": "OK"
    });
    replace(fetcher);  // Replace the /me endpoint with a mock.
    const store = createTestStore();
    // Dispatch login().
    // This will, in turn, dispatch fetchUserData, which will eventually dispatch receiveUserData...
    return store.dispatch(login()).then(() => {
      // ... which will have then updated our store with the data we want.
      const user = getUser(store.getState());
      expect(Object.keys(user)).toContain("id");
      expect(Object.keys(user)).toContain("displayName");
      expect(Object.keys(user)).toContain("username");
      // now let's log out...
      return store.dispatch(logout());
    }).then(() => {
      expect(getUser(store.getState())).toBeNull(); // And the local state was updated
    });
  });
});
