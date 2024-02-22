import { createAction } from 'redux-actions';

import { createTestStore } from "../../../test-utils";
import enrichUserData from "../user";

const INITIAL_STATE = {
    user: {
        isFetching: false,
        data: null,
        profile: {},
    }
};

const store = createTestStore(INITIAL_STATE);

describe('User actions', () => {
    test('Enrich user data auth fail', async () => {
        expect(store.getState().user.isFetching).toBeFalsy();
        try {
            store.dispatch(enrichUserData());
        } catch(e) {
            expect(e.toString()).toEqual("Error: No authenticated user");
        }     
    });

    test('Enrich user data api fail', async () => {
        try {
            store.dispatch(createAction("receiveOidcUserData")({oidcUser: {
                profile: {
                    sub: 'nnn'
                }
            }}));
            store.dispatch(enrichUserData());
        } catch(e) {
            expect(e.toString()).toEqual("Error: Bad response");
        }
    });
});