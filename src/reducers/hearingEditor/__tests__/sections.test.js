import reducer from '../sections';
import { EditorActions } from '../../../actions/hearingEditor';

describe('sections reducer', () => {
  it('should ignore image caption changes when the section has no images', () => {
    const state = {
      byId: {
        'section-1': {
          frontId: 'section-1',
          images: [],
        },
      },
      all: ['section-1'],
      isFetching: false,
    };

    const action = {
      type: EditorActions.CHANGE_SECTION_MAIN_IMAGE_CAPTION,
      payload: {
        sectionID: 'section-1',
        value: { fi: '' },
      },
    };

    const nextState = reducer(state, action);

    expect(nextState).toEqual(state);
  });

  it('should update the caption for an existing section image', () => {
    const state = {
      byId: {
        'section-1': {
          frontId: 'section-1',
          images: [{ id: 'img-1', caption: { fi: 'old' }, url: '/test.jpg' }],
        },
      },
      all: ['section-1'],
      isFetching: false,
    };

    const action = {
      type: EditorActions.CHANGE_SECTION_MAIN_IMAGE_CAPTION,
      payload: {
        sectionID: 'section-1',
        value: { fi: 'new' },
      },
    };

    const nextState = reducer(state, action);

    expect(nextState.byId['section-1'].images).toEqual([
      { id: 'img-1', caption: { fi: 'new' }, url: '/test.jpg' },
    ]);
  });
});
