// Testing addContact function
import configureStore from 'redux-mock-store'
import { thunk } from 'redux-thunk';

import * as api from "../../api"; // Ensure this is the correct path
import * as actions from '../hearingEditor';
import { EditorActions } from '../hearingEditor';

// Mocking API module and middleware setup
jest.mock('./../../api');

const middlewares = [thunk]
const mockStore = configureStore(middlewares);

describe('addContact', () => {
    const initialState = {};
    const store = mockStore(initialState);

    afterEach(() => {
        store.clearActions();
    });

  it('dispatches ADD_CONTACT_SUCCESS on successful contact addition', () => {
    const contact = { name: 'John Doe', email: 'john@example.com' };
    const response = { id: '123', name: 'John Doe', email: 'john@example.com' };
    api.post.mockResolvedValue({ status: 201, json: () => Promise.resolve(response) });

    const expectedActions = [
      { type: EditorActions.ADD_CONTACT },
      { type: EditorActions.ADD_CONTACT_SUCCESS, payload: { contact: response } }
    ];

    store.dispatch(actions.addContact(contact, []));
    expect(store.getActions().type).toEqual(expectedActions.type);
  });

  it('dispatches ADD_CONTACT_FAILED on failure', () => {
    const contact = { name: 'John Doe', email: 'invalid-email' };
    api.post.mockResolvedValue({ status: 400, json: () => Promise.resolve({ message: 'Invalid email' }) });

    const expectedActions = [
      { type: EditorActions.ADD_CONTACT },
      { type: EditorActions.ADD_CONTACT_FAILED, payload: { errors: { message: 'Invalid email' } } }
    ];

    store.dispatch(actions.addContact(contact, []));

    expect(store.getActions().type).toEqual(expectedActions.type);
  });
});
