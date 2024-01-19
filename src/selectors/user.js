/**
 *
 * @param {Object} state
 * @returns User
 */
export const getUser = (state) =>
  state.user.data;

/**
 *
 * @param {Object} state
 * @returns boolean
 */
export const getApiToken = (state) =>
  state.apitoken && state.apitoken.apiToken;
