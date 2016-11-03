import {createTestStore, mockFetch, jsonResponse} from '../test-utils';
import {login, logout} from '../src/actions';
import {replace} from '../src/mockable-fetch';

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
      "/logout": "OK"
    });
    replace(fetcher);  // Replace the /me endpoint with a mock.
    const store = createTestStore();
    // Dispatch login().
    // This will, in turn, dispatch fetchUserData, which will eventually dispatch receiveUserData...
    return store.dispatch(login()).then(() => {
      // ... which will have then updated our store with the data we want.
      const user = store.getState().user;
      expect(Object.keys(user)).toContain("id");
      expect(Object.keys(user)).toContain("displayName");
      expect(Object.keys(user)).toContain("username");
      // now let's log out...
      return store.dispatch(logout());
    }).then(() => {
      expect(fetcher.calls["/logout"]).toEqual(1); // The remote call was made
      expect(store.getState().user).toBeNull(); // And the local state was updated
    });
  });
});
