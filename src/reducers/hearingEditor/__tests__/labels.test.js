import { EditorActions } from '../../../actions/hearingEditor';
import byId from '../labels';

describe('labels', () => {
  it('should return the initial state', () => {
    const expected = { all: [], byId: {}, labels: {} };
    const nextState = byId(undefined, {});

    expect(nextState).toEqual(expected);
  });

  it('should handle RECEIVE_META_DATA action', () => {
    const expected = {
      all: ['1', '2'],
      byId: {
        1: { id: 1, name: 'Label 1' },
        2: { id: 2, name: 'Label 2' }
      },
      labels: {}
    };
    const labels = {
      entities: {
        labels: {
          1: { id: 1, name: 'Label 1' },
          2: { id: 2, name: 'Label 2' },
        },
      },
      result: ['1', '2']
    };
    const action = {
      type: EditorActions.RECEIVE_META_DATA,
      payload: { labels },
    };
    const nextState = byId({}, action);

    expect(nextState).toEqual(expected);
  });

  it('should handle UPDATE_HEARING_AFTER_SAVE action', () => {
    const expected = {
      all: ['2'],
      byId: {
        2: { id: 2, name: 'Label 2' }
      },
      labels: {}
    };

    const state = {
      1: { id: 1, name: 'Label 1' },
    };
    const entities = {
      labels: {
        2: { id: 2, name: 'Label 2' },
      },
    };
    const action = {
      type: EditorActions.UPDATE_HEARING_AFTER_SAVE,
      payload: { entities },
    };
    const nextState = byId(state, action);

    expect(nextState).toEqual(expected);
  });

  it('should handle ADD_LABEL_SUCCESS action', () => {
    const expected = {
      all: ['2'],
      byId: {
        2: { id: 2, name: 'Label 2', frontId: 2 }
      },
      labels: null
    };
    const state = {
      1: { id: 1, name: 'Label 1' },
    };
    const label = { id: 2, name: 'Label 2' };
    const action = {
      type: EditorActions.ADD_LABEL_SUCCESS,
      payload: { label },
    };
    const nextState = byId(state, action);

    expect(nextState).toEqual(expected);
  });
});
