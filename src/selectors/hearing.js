import {head} from 'lodash';

export const getTopHearing = (state) =>
  state.hearingLists.topHearing && state.hearingLists.topHearing.data && head(state.hearingLists.topHearing.data);

export const getOpenHearings = (state) =>
  state.hearingLists.newestHearings.filter((hearing) => !hearing.closed);

export default '';
