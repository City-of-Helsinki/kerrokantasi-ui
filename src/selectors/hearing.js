import {head} from 'lodash';

export const getTopHearing = (state) =>
  state.hearingLists.topHearing && state.hearingLists.topHearing.data && head(state.hearingLists.topHearing.data);

// eslint-disable-next-line
export const getOpenHearings = (state) =>
  state.hearingLists.openHearings;
