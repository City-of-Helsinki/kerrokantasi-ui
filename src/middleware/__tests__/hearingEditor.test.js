/**
 * Tests for hearingEditor middleware functions
 * 
 * These middleware functions handle:
 * - Preventing infinite recursion when syncing hearings to the editor
 * - Normalizing API response data for Redux state
 * - Adding client-side tracking IDs to new entities
 */

import {
  normalizeReceivedHearing,
  normalizeReceiveEditorMetaData,
  normalizeReceiveEditorContactPersons,
  normalizeSavedHearing,
  sectionFrontIds
} from '../hearingEditor';
import { EditorActions } from '../../actions/hearingEditor';

// Mock only external dependencies to ensure predictable test results
vi.mock('normalizr', () => ({
  normalize: vi.fn((data) => ({
    entities: {
      hearing: { 'mock-id': data },
      section: {},
      label: {},
      contactPerson: {},
      organization: {}
    },
    result: 'mock-id'
  })),
  schema: {
    Entity: class MockEntity {
      constructor(key, definition, options) {
        this.key = key;
        this.definition = definition;
        this.options = options;
      }
    },
    Array: class MockArray {
      constructor(definition, options) {
        this.definition = definition;
        this.options = options;
      }
    }
  }
}));

// Mock UUID for consistent frontId generation
vi.mock('uuid', () => ({
  v1: () => 'mock-uuid-123'
}));

describe('hearingEditor middleware', () => {
  let mockDispatch;
  let mockGetState;
  let mockNext;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockGetState = vi.fn();
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('normalizeReceivedHearing', () => {
    it('should skip processing when action is already normalized', () => {
      // This prevents infinite recursion by marking processed actions
      const action = {
        type: "receiveHearing",
        payload: {
          hearingSlug: 'test-hearing',
          data: { slug: 'test-hearing' },
          isNormalized: true // Flag indicates action was already processed
        }
      };

      normalizeReceivedHearing({ dispatch: mockDispatch, getState: mockGetState })(mockNext)(action);

      expect(mockNext).toHaveBeenCalledWith(action);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockGetState).not.toHaveBeenCalled();
    });

    it('should dispatch normalized hearing when editor sync is needed', () => {
      // Middleware decides to sync hearing to editor when:
      // 1. Editor has no hearing data, or 2. Hearing slug differs from current editor hearing
      const testCases = [
        {
          state: { hearingEditor: { hearing: { data: null } } },
          description: 'editor has no hearing'
        },
        {
          state: { hearingEditor: { hearing: { data: { slug: 'different-hearing' } } } },
          description: 'hearing slug differs'
        }
      ];

      testCases.forEach(({ state }) => {
        vi.clearAllMocks();
        mockGetState.mockReturnValue(state);

        const action = {
          type: "receiveHearing",
          payload: {
            hearingSlug: 'test-hearing',
            data: { // Raw hearing data from API
              slug: 'test-hearing',
              title: { fi: 'Test Hearing' },
              sections: [],
              contact_persons: [],
              labels: []
            }
          }
        };

        normalizeReceivedHearing({ dispatch: mockDispatch, getState: mockGetState })(mockNext)(action);

        // Should dispatch normalized hearing to editor
        expect(mockDispatch).toHaveBeenCalledWith({
          type: EditorActions.RECEIVE_HEARING,
          payload: expect.objectContaining({
            entities: expect.any(Object),
            result: expect.any(String),
            isNormalized: true // Flag prevents re-processing
          })
        });

        // Should mark original action as normalized before passing through
        expect(mockNext).toHaveBeenCalledWith({
          ...action,
          payload: { ...action.payload, isNormalized: true }
        });
      });
    });

    it('should skip editor dispatch when hearing already matches', () => {
      // Performance optimization: don't re-sync if hearing is already in editor
      mockGetState.mockReturnValue({
        hearingEditor: { hearing: { data: { slug: 'same-hearing' } } }
      });

      const action = {
        type: "receiveHearing",
        payload: {
          hearingSlug: 'same-hearing',
          data: { slug: 'same-hearing' }
        }
      };

      normalizeReceivedHearing({ dispatch: mockDispatch, getState: mockGetState })(mockNext)(action);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith({
        ...action,
        payload: { ...action.payload, isNormalized: true }
      });
    });

    it('should not process EditorActions.RECEIVE_HEARING actions', () => {
      // Middleware should ignore editor actions to prevent recursion
      const editorAction = {
        type: EditorActions.RECEIVE_HEARING,
        payload: {
          entities: { hearing: { 'test-id': { slug: 'test-hearing' } } },
          result: 'test-id',
          isNormalized: true
        }
      };

      normalizeReceivedHearing({ dispatch: mockDispatch, getState: mockGetState })(mockNext)(editorAction);

      // Should pass through without processing
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockGetState).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(editorAction);
    });
  });

  describe('normalizeReceiveEditorMetaData', () => {
    it('should normalize labels and organizations for editor dropdowns', () => {
      const middleware = normalizeReceiveEditorMetaData();
      const action = {
        type: EditorActions.RECEIVE_META_DATA,
        payload: {
          labels: [{ id: 1, name: 'Environment' }, { id: 2, name: 'Transport' }],
          organizations: [{ id: 1, name: 'City Planning Department' }]
        }
      };

      middleware(mockNext)(action);

      // Should transform flat arrays into normalized entities structure
      expect(mockNext).toHaveBeenCalledWith({
        type: action.type,
        payload: {
          labels: expect.objectContaining({
            entities: expect.any(Object),
            result: expect.any(String)
          }),
          organizations: expect.objectContaining({
            entities: expect.any(Object),
            result: expect.any(String)
          })
        }
      });
    });
  });

  describe('normalizeReceiveEditorContactPersons', () => {
    it('should normalize contact persons for editor selection', () => {
      const middleware = normalizeReceiveEditorContactPersons();
      const action = {
        type: EditorActions.RECEIVE_CONTACT_PERSONS,
        payload: {
          contactPersons: [{ id: 1, name: 'John Doe', email: 'john@example.com' }]
        }
      };

      middleware(mockNext)(action);

      // Should transform contact persons array into normalized structure
      expect(mockNext).toHaveBeenCalledWith({
        type: action.type,
        payload: {
          contactPersons: expect.objectContaining({
            entities: expect.any(Object),
            result: expect.any(String)
          })
        }
      });
    });
  });

  describe('normalizeSavedHearing', () => {
    it('should update editor with saved hearing data', () => {
      const middleware = normalizeSavedHearing({ dispatch: mockDispatch });
      const hearingFromAPI = {
        id: 'test-hearing-id',
        slug: 'test-hearing',
        title: { fi: 'Test kuuleminen' },
        sections: [],
        contact_persons: [],
        labels: []
      };

      // Test both creation and update success actions (same behavior)
      const actions = [
        { type: EditorActions.POST_HEARING_SUCCESS, payload: { hearing: hearingFromAPI } },
        { type: EditorActions.SAVE_HEARING_SUCCESS, payload: { hearing: hearingFromAPI } }
      ];

      actions.forEach((action) => {
        vi.clearAllMocks();
        middleware(mockNext)(action);

        // Should dispatch update action with hearing marked as not new (saved)
        expect(mockDispatch).toHaveBeenCalledWith({
          type: EditorActions.UPDATE_HEARING_AFTER_SAVE,
          payload: expect.objectContaining({
            entities: expect.any(Object),
            result: expect.any(String)
          })
        });
        expect(mockNext).toHaveBeenCalledWith(action);
      });
    });
  });

  describe('sectionFrontIds', () => {
    it('should add client-side tracking ID to new sections', () => {
      const middleware = sectionFrontIds();
      const action = {
        type: EditorActions.ADD_SECTION,
        payload: {
          section: { id: '', type: 'main', title: { fi: 'Uusi osio' } },
          hearingId: 'parent-hearing-id'
        }
      };

      middleware(mockNext)(action);

      // Should add frontId while preserving other payload data
      expect(mockNext).toHaveBeenCalledWith({
        type: action.type,
        payload: {
          section: expect.objectContaining({
            frontId: 'mock-uuid-123' // Client-side ID for tracking before save
          }),
          hearingId: 'parent-hearing-id'
        }
      });
    });
  });

  describe('Middleware independence', () => {
    it('should ignore unrelated actions without side effects', () => {
      // Ensure all middleware functions properly ignore actions they don't handle
      const middlewares = [
        normalizeReceivedHearing({ dispatch: mockDispatch, getState: mockGetState }),
        normalizeReceiveEditorMetaData(),
        normalizeReceiveEditorContactPersons(),
        normalizeSavedHearing({ dispatch: mockDispatch }),
        sectionFrontIds()
      ];

      const action = { type: 'OTHER_ACTION', payload: { data: 'test' } };

      middlewares.forEach(middleware => {
        vi.clearAllMocks();
        middleware(mockNext)(action);
        expect(mockNext).toHaveBeenCalledWith(action);
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('should not process EditorActions.RECEIVE_HEARING in normalizeReceivedHearing', () => {
      // Verify middleware ignores editor-specific actions
      const editorAction = {
        type: EditorActions.RECEIVE_HEARING,
        payload: { entities: {}, result: 'test' }
      };

      normalizeReceivedHearing({ dispatch: mockDispatch, getState: mockGetState })(mockNext)(editorAction);

      expect(mockNext).toHaveBeenCalledWith(editorAction);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockGetState).not.toHaveBeenCalled();
    });
  });
});
