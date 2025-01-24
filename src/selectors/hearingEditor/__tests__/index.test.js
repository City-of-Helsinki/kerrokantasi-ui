import * as selectors from '../index';

describe('hearingEditor selectors', () => {
  const state = {
    hearingEditor: {
      project: 'Project',
      hearing: {
        isFetching: true,
        data: {
          id: 1,
          contact_persons: ['id1', 'id2'],
          labels: ['id1', 'id2'],
          sections: ['id1', 'id2'],
        },
      },
      labels: {
        isFetching: true,
        byId: {
          'id1': { id: 'id1', name: 'Label 1' },
          'id2': { id: 'id2', name: 'Label 2' },
        },
        all: ['id1', 'id2']
      },
      sections: {
        byId: {
          'id1': { id: 'id1', name: 'Section 1' },
          'id2': { id: 'id2', name: 'Section 2' },
        },
        all: ['id1', 'id2']
      },
      contactPersons: {
        byId: {
          'id1': { id: 'id1', name: 'Contact 1' },
          'id2': { id: 'id2', name: 'Contact 2' },
        },
        all: ['id1', 'id2']
      },
      editorState: {
        pending: 1,
        show: true,
        isSaving: false,
        state: 'Editor State',
      },
    },
  };

  describe('getHearingEditor', () => {
    it('should return the hearing editor state', () => {
      expect(selectors.getHearingEditor(state)).toEqual(state.hearingEditor);
    });
  });

  describe('getProjects', () => {
    it('should return the projects from the hearing editor state', () => {
      expect(selectors.getProjects(state)).toEqual(state.hearingEditor.project);
    });
  });

  describe('getIsFetchingHearing', () => {
    it('should return the isFetchingHearing value from the hearing editor state', () => {
      expect(selectors.getIsFetchingHearing(state)).toEqual(state.hearingEditor.hearing.isFetching);
    });
  });

  describe('getIsLoading', () => {
    it('should return true if the editorState pending value is greater than 0', () => {
      expect(selectors.getIsLoading(state)).toEqual(true);
    });
  });

  describe('getShowForm', () => {
    it('should return the show value from the editorState in the hearing editor state', () => {
      expect(selectors.getShowForm(state)).toEqual(state.hearingEditor.editorState.show);
    });
  });

  describe('getIsSaving', () => {
    it('should return the isSaving value from the editorState in the hearing editor state', () => {
      expect(selectors.getIsSaving(state)).toEqual(state.hearingEditor.editorState.isSaving);
    });
  });

  describe('getHearing', () => {
    it('should return the hearing data from the hearing editor state', () => {
      expect(selectors.getHearing(state)).toEqual(state.hearingEditor.hearing.data);
    });
  });

  describe('getEditorState', () => {
    it('should return the editorState state from the hearing editor state', () => {
      expect(selectors.getEditorState(state)).toEqual(state.hearingEditor.editorState.state);
    });
  });

  describe('getPopulatedHearing', () => {
    it('should return the hearing data with populated contact persons, labels, and sections', () => {
      const expected = {
        ...state.hearingEditor.hearing.data,
        contact_persons: [
          state.hearingEditor.contactPersons.byId.id1,
          state.hearingEditor.contactPersons.byId.id2,
        ],
        labels: [
          state.hearingEditor.labels.byId.id1,
          state.hearingEditor.labels.byId.id2,
        ],
        sections: [
          state.hearingEditor.sections.byId.id1,
          state.hearingEditor.sections.byId.id2,
        ],
      };
      expect(selectors.getPopulatedHearing(state)).toEqual(expected);
    });

    it('should return null if the hearing data is null', () => {
      const newState = {
        ...state,
        hearingEditor: {
          ...state.hearingEditor,
          hearing: {
            ...state.hearingEditor.hearing,
            data: null,
          },
        },
      };
      expect(selectors.getPopulatedHearing(newState)).toBeNull();
    });
  });

  describe('getLabelsState', () => {
    it('should return the labels state from the hearing editor state', () => {
      expect(selectors.getLabelsState(state)).toEqual(state.hearingEditor.labels);
    });
  });

  describe('getLabels', () => {
    it('should return all labels from the labels state in the hearing editor state', () => {
      expect(selectors.getLabels(state)).toEqual([
        state.hearingEditor.labels.byId.id1,
        state.hearingEditor.labels.byId.id2,
      ]);
    });
  });

  describe('getLabelById', () => {
    it('should return the label with the specified id from the labels state in the hearing editor state', () => {
      expect(selectors.getLabelById(state, 'id1')).toEqual(state.hearingEditor.labels.byId.id1);
    });
  });

  describe('getSectionsState', () => {
    it('should return the sections state from the hearing editor state', () => {
      expect(selectors.getSectionsState(state)).toEqual(state.hearingEditor.sections);
    });
  });

  describe('getSections', () => {
    it('should return all sections from the sections state in the hearing editor state', () => {
      expect(selectors.getSections(state)).toEqual([
        state.hearingEditor.sections.byId.id1,
        state.hearingEditor.sections.byId.id2,
      ]);
    });
  });

  describe('getSectionById', () => {
    it('should return the section with the specified id from the sections state in the hearing editor state', () => {
      expect(selectors.getSectionById(state, 'id1')).toEqual(state.hearingEditor.sections.byId.id1);
    });
  });

  describe('getContactPersonsState', () => {
    it('should return the contactPersons state from the hearing editor state', () => {
      expect(selectors.getContactPersonsState(state)).toEqual(state.hearingEditor.contactPersons);
    });
  });

  describe('getContactPersons', () => {
    it('should return all contact persons from the contactPersons state in the hearing editor state', () => {
      expect(selectors.getContactPersons(state)).toEqual([
        state.hearingEditor.contactPersons.byId.id1,
        state.hearingEditor.contactPersons.byId.id2,
      ]);
    });
  });

  describe('getContactPersonById', () => {
    it('should return the contact person with the specified id from the contactPersons state in the hearing editor state', () => {
      expect(selectors.getContactPersonById(state, 'id1')).toEqual(state.hearingEditor.contactPersons.byId.id1);
    });
  });
});
