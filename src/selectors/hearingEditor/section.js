// @flow
import {getHearingEditor} from './index';
import type {AppState} from '../../types';

export const getSectionByFrontId = (state: AppState, id: string) =>
  getHearingEditor(state).sections[id];

export default null;
