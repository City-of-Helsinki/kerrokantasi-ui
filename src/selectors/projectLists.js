// @flow
import type {AppState} from '../types';

export const getProjects = (state: AppState): [Object] => state.projectLists.data;
