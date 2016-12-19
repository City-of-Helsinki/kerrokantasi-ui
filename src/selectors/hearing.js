import {head} from 'lodash';

export const getTopHearing = (state) =>
  state.hearingLists.topHearing && state.hearingLists.topHearing.data && head(state.hearingLists.topHearing.data);

// eslint-disable-next-line
export const getOpenHearings = ({hearingLists: {newestHearings}}) =>
  Object.assign(
    {},
    newestHearings,
    newestHearings ? {data: newestHearings.data && newestHearings.data.filter((hearing) =>
      !hearing.closed && hearing.published
    )} : {}
  );
