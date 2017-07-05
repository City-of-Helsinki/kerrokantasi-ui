// @flow
import type {HearingState} from '../../types';

/*
  Selectors that take `hearing` state as state.
*/

export const getHearing = (state: HearingState) => state.data;

export const getIsFetching = (state: HearingState) => state.isFetching;

export default null;
