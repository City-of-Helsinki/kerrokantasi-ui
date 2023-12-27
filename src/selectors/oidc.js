/**
 *
 * @param {Object} state
 * @returns User
 */
export const getOidcUser = (state) =>
  state.oidc?.user;

/**
 *
 * @param {Object} state
 * @returns String
 */
export const getAccessToken = (state) =>
  state.oidc?.user?.access_token;
