import { EditorActions } from '../../../actions/hearingEditor';
import all from '../organizations';

describe('organizations', () => {
  it('should handle RECEIVE_META_DATA action', () => {
    const expected = {
      all: [
        { id: 1, name: 'Organization 1' },
        { id: 2, name: 'Organization 2' },
      ]
    };
    const organizations = {
      entities: {
        organizations: {
          1: { id: 1, name: 'Organization 1' },
          2: { id: 2, name: 'Organization 2' },
        },
      },
    };
    const action = {
      type: EditorActions.RECEIVE_META_DATA,
      payload: { organizations },
    };
    const nextState = all([], action);
    expect(nextState).toEqual(expected);
  });
});
