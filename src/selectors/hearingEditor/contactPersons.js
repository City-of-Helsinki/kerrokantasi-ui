// @flow
import type {ContactPersonState} from '../../types';

export const getAll = (state: ContactPersonState) => state.all.map(id => state.byId[id]);

export const getById = (state: ContactPersonState, id: string) => state.byId[id];

export default null;
