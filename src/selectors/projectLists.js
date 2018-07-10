// @flow
import type {AppState} from '../types';

export const getProjects = (state: AppState): [Object] => {
  return state.projectLists.data;
};

export default getProjects;
