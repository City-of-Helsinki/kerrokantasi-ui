/**
 *
 * @param {AppState} state
 * @returns Array<Object>
 */
export const getProjects = (state) => {
  return state.projectLists.data;
};

export default getProjects;
