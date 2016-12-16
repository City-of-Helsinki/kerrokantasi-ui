import {chain} from 'lodash';

export const getTopHearing = (state) =>
  state.hearingLists.newestHearings && state.hearingLists.newestHearings.data &&
  chain(state.hearingLists.newestHearings.data)
    .filter({closed: false})
    .sortBy([(hearing) => -hearing.n_comments])
    .head()
    .value()
;

export const getOpenHearings = (state) =>
  state.hearingLists.newestHearings.filter((hearing) => !hearing.closed);

export default '';
