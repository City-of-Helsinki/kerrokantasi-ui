/**
 * 
 * @param {AppState} state 
 * @returns User
 */
export const getUser = (state) =>
  state.user.data;

/**
 * 
 * @param {AppState} state 
 * @returns boolean
 */
export const getApiToken = (state) =>
  state.apitoken && state.apitoken.apiToken;

/**
 * 
 * @param {AppState} state 
 * @returns boolean
 */
export const getAccessToken = (state) =>
  state.oidc.user && state.oidc.user.access_token;
