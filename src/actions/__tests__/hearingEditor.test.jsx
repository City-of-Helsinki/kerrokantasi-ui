import configureStore from 'redux-mock-store'
import { thunk } from 'redux-thunk';

import * as api from "../../api";
import * as actions from '../hearingEditor';
import { EditorActions } from '../hearingEditor';
import { NOTIFICATION_TYPES, createNotificationPayload } from '../../utils/notify';
import { addToast } from '../toast';

// Mocking API module and middleware setup
vi.mock('../../api', () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    apiDelete: vi.fn(),
    getApiTokenFromStorage: vi.fn(() => 'dummykey'),
    getAllFromEndpoint: vi.fn(),
}));
const middlewares = [thunk]
const mockStore = configureStore(middlewares);

describe('HearingEditor actions', () => {
    const mockHearing = {
        id: '1',
        title: 'Original Title',
        sections: [],
        labels: [],
        contact_persons: []
    };
    const mockProcessedHearing = {
        id: '1',
        title: {},
        sections: [],
        labels: [],
        contact_persons: [],
        abstract: {},
        main_image: null
    };
    const initialState = {
        hearingEditor: { languages: ['en', 'fi'] },
        language: 'en'
    };
    let store = mockStore(initialState);

    let dateNowSpy;

    beforeAll(() => {
        // Lock Time
        dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
    });

    afterAll(() => {
        // Unlock Time
        dateNowSpy.mockRestore();
    });

    afterEach(() => {
        store.clearActions();
        store = mockStore(initialState);
    });
    describe('Simple Synchronous Actions', () => {
        it('should create an action to change a project', () => {
            const projectId = '123';
            const projectLists = ['Project 1', 'Project 2'];
            const expectedAction = {
                type: EditorActions.CHANGE_PROJECT,
                payload: { projectId, projectLists }
            };
            const response = actions.changeProject(projectId, projectLists)
            expect(response.payload).toEqual(expectedAction.payload.projectId);
        });

        it('should create an action to update project language', () => {
            const languages = ['en', 'fi'];
            const expectedAction = {
                type: EditorActions.UPDATE_PROJECT_LANGUAGE,
                payload: { languages }
            };
            expect(actions.updateProjectLanguage(languages)).toEqual(expectedAction);
        });

        it('should create an action to activate a phase', () => {
            const phaseId = 'phase1';
            const expectedAction = {
                type: EditorActions.ACTIVE_PHASE,
                payload: { phaseId }
            };
            expect(actions.activePhase(phaseId)).toEqual(expectedAction);
        });
    });

    describe('Asynchronous Actions', () => {
        it('fetches metadata and dispatches RECEIVE_META_DATA', async () => {
            // Mock API responses
            api.getAllFromEndpoint.mockImplementation(endpoint => {
                if (endpoint === '/v1/label/') return Promise.resolve(['Label 1', 'Label 2']);
                if (endpoint === '/v1/organization/') return Promise.resolve(['Org 1', 'Org 2']);
                return Promise.resolve();
            });
            const expectedActions = [
                { type: EditorActions.FETCH_META_DATA },
                { type: EditorActions.RECEIVE_META_DATA, payload: { labels: ['Label 1', 'Label 2'], organizations: ['Org 1', 'Org 2'] } }
            ];
            await store.dispatch(actions.fetchHearingEditorMetaData());
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('handles errors in fetching metadata', async () => {
            const error = new Error('Network Error');
            api.getAllFromEndpoint.mockRejectedValue(error);
            const expectedActions = [
                { type: EditorActions.FETCH_META_DATA },
                { type: EditorActions.ERROR_META_DATA, payload: { err: error } }
            ];
            await store.dispatch(actions.fetchHearingEditorMetaData());
            expect(store.getActions()).toContainEqual(expectedActions[1]);
        });

        it('adds an attachment and dispatches ADD_ATTACHMENT', async () => {
            const section = 'section1';
            const file = new Blob(['file content'], { type: 'text/plain' });
            const title = 'New Attachment';
            const isNew = true;
            const attachment = { id: '123', title: 'New Attachment' };
            api.post.mockResolvedValue({ status: 200, json: () => Promise.resolve(attachment) });

            const expectedActions = [
              {
                type: EditorActions.ADD_ATTACHMENT,
                payload: { sectionId: section, attachment: { ...attachment, isNew: true } },
              },
            ];

            await store.dispatch(actions.addSectionAttachment(section, file, title, isNew));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    describe('Deletion Actions', () => {
        it('deletes a section attachment and dispatches DELETE_ATTACHMENT', async () => {
            const sectionId = 'sec123';
            const attachment = { id: 'att123', file: {} };
            api.apiDelete.mockResolvedValue({ status: 200 });

            const expectedActions = [
                { type: EditorActions.DELETE_ATTACHMENT, payload: { sectionId, attachment } }
            ];

            await store.dispatch(actions.deleteSectionAttachment(sectionId, attachment));
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('deletes a phase and dispatches DELETE_PHASE', async () => {
            const phaseId = 'phase123';
            const expectedAction = {
                type: EditorActions.DELETE_PHASE,
                payload: { phaseId }
            };

            store.dispatch(actions.deletePhase(phaseId));
            expect(store.getActions()).toContainEqual(expectedAction);
        });
    });
    describe('Modification Actions', () => {
        it('dispatches EDIT_SECTION when changing a section', () => {
            const sectionID = 'sec123';
            const field = 'title';
            const value = 'Updated Title';
            const expectedAction = {
            type: EditorActions.EDIT_SECTION,
            payload: { sectionID, field, value }
            };

            store.dispatch(actions.changeSection(sectionID, field, value));
            expect(store.getActions()).toContainEqual(expectedAction);
        });

        it('dispatches EDIT_QUESTION when editing a question', () => {
            const fieldType = 'text';
            const sectionId = 'sec123';
            const questionId = 'ques123';
            const optionKey = 'opt1';
            const value = 'New Value';
            const expectedAction = {
            type: EditorActions.EDIT_QUESTION,
            payload: { fieldType, sectionId, questionId, value, optionKey }
            };
            store.dispatch(actions.editQuestion(fieldType, sectionId, questionId, optionKey, value));
            expect(store.getActions()).toContainEqual(expectedAction);
        });
    });
    describe('saveHearingChanges', () => {
        it('dispatches SAVE_HEARING_SUCCESS and navigates on successful save', async () => {
          const hearing = mockHearing;
          const hearingJSON = { id: '1', title: 'Original Title', slug: 'new-slug' };
          const response = { status: 200, json: () => Promise.resolve(hearingJSON) };
          api.put.mockResolvedValue(response);

          const expectedActions = [
            { type: EditorActions.SAVE_HEARING, payload: { cleanedHearing: mockProcessedHearing } },
            { type: EditorActions.SAVE_HEARING_SUCCESS, payload: { hearing: hearingJSON } }
          ];

          await store.dispatch(actions.saveHearingChanges(hearing));

          expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
        });

        it('dispatches SAVE_HEARING_FAILED on API bad request', async () => {
          const hearing = mockHearing;
          const errors = { message: 'Invalid data' };
          const response = { status: 400, json: () => Promise.resolve(errors) };
          api.put.mockResolvedValue(response);

          const expectedActions = [
            { type: EditorActions.SAVE_HEARING, payload: { cleanedHearing: mockProcessedHearing } },
            { type: EditorActions.SAVE_HEARING_FAILED, payload: { errors } }
          ];

          await store.dispatch(actions.saveHearingChanges(hearing));

          expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
        });

        it('handles unauthorized error', async () => {
          const hearing = mockHearing;
          const response = { status: 401, json: () => Promise.resolve({}) };
          api.put.mockResolvedValue(response);

          const expectedActions = [
            { type: EditorActions.SAVE_HEARING, payload: { cleanedHearing: mockProcessedHearing } }
          ];

          await store.dispatch(actions.saveHearingChanges(hearing));

          expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
        });
      });
    describe('saveContact', () => {
        Date.now = vi.fn(() => 1234567890);
        const testPerson = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
        const testPersonData = { name: 'John Doe', email: 'john.doe@example.com' }
        it('dispatches success actions on successful contact save', async () => {
          const contact = testPerson;
          const response = { status: 200, json: () => Promise.resolve(contact) };
          api.put.mockResolvedValue(response);

          const expectedActions = [
            addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Muokkaus onnistui')),
          ];

          await store.dispatch(actions.saveContact(contact));
          expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
          expect(api.put).toHaveBeenCalledWith(`/v1/contact_person/${contact.id}/`, testPersonData);
        });

        it('dispatches error actions on contact save failure (400)', async () => {
          const contact = testPerson
          const response = { status: 400, json: () => Promise.resolve({}) };
          api.put.mockResolvedValue(response);

          const expectedActions = [
            addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Sinulla ei ole oikeutta muokata yhteyshenkilöä.')),
          ];

          await store.dispatch(actions.saveContact(contact));
          expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
          expect(api.put).toHaveBeenCalledWith(`/v1/contact_person/${contact.id}/`, testPersonData);
        });

        it('dispatches error actions on contact save failure (401)', async () => {
          const contact = testPerson;
          const response = { status: 401, json: () => Promise.resolve({}) };
          api.put.mockResolvedValue(response);

          const expectedActions = [
            addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Et voi luoda yhteyshenkilöä.')),
          ];

          await store.dispatch(actions.saveContact(contact));
          expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
          expect(api.put).toHaveBeenCalledWith(`/v1/contact_person/${contact.id}/`, testPersonData);
        });
    });
    describe('addLabel', () => {
      const mockLabel = { name: 'New Label' };
      const mockSelectedLabels = ['label1', 'label2'];
      const responseLabel = { id: '123', name: 'New Label' };

      it('dispatches ADD_LABEL_SUCCESS on successful label addition', async () => {
        api.post.mockResolvedValue({ status: 201, json: () => Promise.resolve(responseLabel) });

        const expectedActions = [
          { type: EditorActions.ADD_LABEL },
          { type: EditorActions.ADD_LABEL_SUCCESS, payload: { label: responseLabel } },
          { type: EditorActions.EDIT_HEARING, payload: { field: 'labels', value: [...mockSelectedLabels, responseLabel.id] } },
          addToast(createNotificationPayload(NOTIFICATION_TYPES.success, 'Luonti onnistui'))
        ];

        await store.dispatch(actions.addLabel(mockLabel, mockSelectedLabels));
        expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
      });

      it('dispatches ADD_LABEL_FAILED on failure (400)', async () => {
        const errorResponse = { message: 'Invalid label data' };
        api.post.mockResolvedValue({ status: 400, json: () => Promise.resolve(errorResponse) });

        const expectedActions = [
          { type: EditorActions.ADD_LABEL },
          addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Tarkista asiasanan tiedot.')),
          { type: EditorActions.ADD_LABEL_FAILED, payload: { errors: errorResponse } }
        ];

        await store.dispatch(actions.addLabel(mockLabel, mockSelectedLabels));
        expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
      });

      it('dispatches error actions on unauthorized failure (401)', async () => {
        api.post.mockResolvedValue({ status: 401, json: () => Promise.resolve({}) });

        const expectedActions = [
          { type: EditorActions.ADD_LABEL },
          addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Et voi luoda asiasanaa.'))
        ];

        await store.dispatch(actions.addLabel(mockLabel, mockSelectedLabels));
        expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
      });
    });
    describe('saveAndPreviewHearingChanges', () => {
      it('dispatches SAVE_HEARING and SAVE_HEARING_SUCCESS on successful save', async () => {
        const response = { status: 200, json: () => Promise.resolve(mockHearing) };

        api.put.mockResolvedValue(response);
        const cleanedHearing = mockProcessedHearing;

        const expectedActions = [
          { type: EditorActions.SAVE_HEARING, payload: { cleanedHearing } },
          { type: EditorActions.SAVE_HEARING_SUCCESS, payload: { hearing: mockHearing } },
        ];

        await store.dispatch(actions.saveAndPreviewHearingChanges(mockHearing));

        const dispatchedActions = store.getActions();
        const filteredActions = dispatchedActions.map(({ meta, ...action }) => action);

        expect(filteredActions).toEqual(expect.arrayContaining(expectedActions));
      });

      it('dispatches SAVE_HEARING and SAVE_HEARING_FAILED on API error', async () => {
        const errors = { message: 'Invalid data' };
        const response = { status: 400, json: () => Promise.resolve(errors) };

        api.put.mockResolvedValue(response);

        const cleanedHearing = mockProcessedHearing;

        const expectedActions = [
          { type: EditorActions.SAVE_HEARING, payload: { cleanedHearing } },
          { type: EditorActions.SAVE_HEARING_FAILED, payload: { errors } },
        ];

        await store.dispatch(actions.saveAndPreviewHearingChanges(mockHearing));

        const dispatchedActions = store.getActions();
        const filteredActions = dispatchedActions.map(({ meta, ...action }) => action);

        expect(filteredActions).toEqual(expect.arrayContaining(expectedActions));
      });

      it('handles unauthorized error', async () => {
        const response = { status: 401, json: () => Promise.resolve({}) };

        api.put.mockResolvedValue(response);

        const cleanedHearing = mockProcessedHearing;

        const expectedActions = [
          { type: EditorActions.SAVE_HEARING, payload: { cleanedHearing } },
          { type: EditorActions.SAVE_HEARING_FAILED, payload: { errors: {} } },
        ];

        await store.dispatch(actions.saveAndPreviewHearingChanges(mockHearing));

        const dispatchedActions = store.getActions();
        const filteredActions = dispatchedActions.map(({ meta, ...action }) => action);

        expect(filteredActions).toEqual(expect.arrayContaining(expectedActions));
      });
    });
});


