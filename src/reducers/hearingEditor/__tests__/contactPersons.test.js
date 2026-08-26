import { EditorActions } from '../../../actions/hearingEditor';
import contactPersonsReducer from '../contactPersons';

describe('contactPersons reducer', () => {
  it('populates byId and all from RECEIVE_CONTACT_PERSONS', () => {
    const contactPersons = {
      entities: { contactPersons: { 1: { id: 1, name: 'Foo' } } },
      result: [1],
    };
    const action = {
      type: EditorActions.RECEIVE_CONTACT_PERSONS,
      payload: { contactPersons },
    };

    const state = contactPersonsReducer(undefined, action);

    expect(state.byId).toEqual({ 1: { id: 1, name: 'Foo' } });
    expect(state.all).toEqual(['1']);
  });

  it('defaults byId to an empty object when contactPersons entities are missing', () => {
    const action = {
      type: EditorActions.RECEIVE_CONTACT_PERSONS,
      payload: { contactPersons: { entities: {}, result: [] } },
    };

    const state = contactPersonsReducer(undefined, action);

    expect(state.byId).toEqual({});
  });

  it('merges contact persons into byId and all on UPDATE_HEARING_AFTER_SAVE', () => {
    const initialState = {
      byId: { 1: { id: 1, name: 'Foo' } },
      all: ['1'],
    };
    const action = {
      type: EditorActions.UPDATE_HEARING_AFTER_SAVE,
      payload: {
        entities: { contactPersons: { 2: { id: 2, name: 'Bar' } } },
      },
    };

    const state = contactPersonsReducer(initialState, action);

    expect(state.byId).toEqual({
      1: { id: 1, name: 'Foo' },
      2: { id: 2, name: 'Bar' },
    });
    expect(state.all).toEqual(['1', '2']);
  });

  it('keeps existing state on UPDATE_HEARING_AFTER_SAVE when entities have no contactPersons', () => {
    const initialState = {
      byId: { 1: { id: 1, name: 'Foo' } },
      all: ['1'],
    };
    const action = {
      type: EditorActions.UPDATE_HEARING_AFTER_SAVE,
      payload: { entities: {} },
    };

    const state = contactPersonsReducer(initialState, action);

    expect(state.byId).toEqual({ 1: { id: 1, name: 'Foo' } });
    expect(state.all).toEqual(['1']);
  });
});
