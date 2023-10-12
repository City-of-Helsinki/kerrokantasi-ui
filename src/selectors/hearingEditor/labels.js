export const getAll = (state) =>
  state.all.map(frontId => state.byId[frontId]);

export const getById = (state, id) =>
  state.byId[id];

export default null;
