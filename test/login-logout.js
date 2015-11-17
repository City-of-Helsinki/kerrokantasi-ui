import {createTestStore, mockFetch, jsonResponse} from './utils';
import {login, logout} from 'actions';
import {replace} from 'mockable-fetch';

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
        provider: 'helsinki'
      }),
      "/logout": "OK"
    });
    replace(fetcher);  // Replace the /me endpoint with a mock.
    const store = createTestStore();
    // Dispatch login().
    // This will, in turn, dispatch fetchUserData, which will eventually dispatch receiveUserData...
    return store.dispatch(login()).then(() => {
      // ... which will have then updated our store with the data we want.
      expect(store.getState().user).to.contain.keys("id", "displayName", "username");
      // now let's log out...
      return store.dispatch(logout());
    }).then(() => {
      expect(fetcher.calls["/logout"]).to.equal(1); // The remote call was made
      expect(store.getState().user).to.be.null; // And the local state was updated
    });
  });
});
