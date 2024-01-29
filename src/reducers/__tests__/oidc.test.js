import { createStore } from "redux";

import oidc from '../oidc';

const INITIAL_STATE = {
  isFetching: false,
  user: null,
};

const dummyUser = 'testUser';
const payload = { oidcUser: dummyUser }

describe('oidc', () => {
  let store;

  beforeEach(() => {
    store = createStore(oidc);
  });

  it('should set isFetching to true', () => {
    expect(store.getState().isFetching).not.toBeTruthy();
    store.dispatch({ type: 'fetchOidcUserData' });
    expect(store.getState().isFetching).toBeTruthy();
  });

  it('should set the user', () => {
    expect(store.getState().user).toBeNull();
    store.dispatch({ type: 'receiveOidcUserData', payload });
    expect(store.getState().user).toEqual(dummyUser);
  });

  it('should clear the user and set state to default', () => {
    store.dispatch({ type: 'receiveOidcUserData', payload });
    expect(store.getState()).not.toEqual(INITIAL_STATE);
    store.dispatch({ type: 'clearOidcUserData' });
    expect(store.getState()).toEqual(INITIAL_STATE);
  });
})
