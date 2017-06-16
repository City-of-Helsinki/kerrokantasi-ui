// @flow
import {getEditorState} from './index';
import type {AppState} from '../../types';

export const getSectionByFrontId = (state: AppState, id: string) =>
  getEditorState(state).sections[id];

export default null;
