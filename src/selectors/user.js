// @flow
import type {AppState, User} from '../types';

export const getUser = (state: AppState): User =>
  state.user.data;

export const getApiToken = (state: AppState): User =>
  state.apitoken && state.apitoken.apiToken;

export const getAccessToken = (state: AppState): User =>
  state.oidc.user && state.oidc.user.access_token;
