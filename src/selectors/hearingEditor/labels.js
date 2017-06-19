// @flow
import type {LabelState} from '../../types';


export const getAll = (state: LabelState): Array<Object> =>
  state.all.map(frontId => state.byId[frontId]);

export const getById = (state: LabelState, id: string): Object =>
  state.byId[id];

export default null;
