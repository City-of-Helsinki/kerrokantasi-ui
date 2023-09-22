export const getAll = (state) =>
  state.all.map(id => state.byId[id]);

export const getById = (state, id) =>
  state.byId[id];

export default null;
