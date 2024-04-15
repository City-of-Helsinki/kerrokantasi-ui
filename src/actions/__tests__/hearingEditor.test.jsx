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

describe('HearingEditor actions', () => {
    const initialState = {};
    let store = mockStore(initialState);

    afterEach(() => {
        store.clearActions();
        store = mockStore(initialState);
    });
    describe('addContact', () => {
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
                { type: EditorActions.ADD_ATTACHMENT, payload: { sectionId: section, attachment } }
            ];
        
            await store.dispatch(actions.addSectionAttachment(section, file, title, isNew));
            expect(store.getActions()).toEqual(expectedActions);
        });
      });
      describe('Deletion Actions', () => {
        it('deletes a section attachment and dispatches DELETE_ATTACHMENT', async () => {
            const sectionId = 'sec123';
            const attachment = { id: 'att123' };
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
});
