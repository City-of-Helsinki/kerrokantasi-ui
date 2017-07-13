// @flow
import type {AppState, User} from '../types';

export const getUser = (state: AppState): User =>
  state.user.data;

export const getIsFetching = (state: AppState): boolean =>
  state.user.isFetching;
