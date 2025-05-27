const HearingLists = {
  ALL: {
    list: 'allHearings',
    isFetching: false,
    params: {},
    formattedMessage: 'allHearings',
    iconName: 'globe',
  },
  OPEN: {
    list: 'openHearings',
    isFetching: false,
    params: {},
    formattedMessage: 'openHearings',
    iconName: 'commenting-o',
  },
  PUBLISHED: {
    list: 'publishedHearings',
    isFetching: false,
    params: { published: 'True' },
    formattedMessage: 'publishedHearings',
    iconName: 'eye',
  },
  QUEUE: {
    list: 'publishingQueueHearings',
    isFetching: false,
    params: { published: 'True' },
    formattedMessage: 'publishingQueue',
    iconName: 'calendar-check-o',
  },
  DRAFTS: {
    list: 'draftHearings',
    isFetching: false,
    params: { published: 'False' },
    formattedMessage: 'drafts',
    iconName: 'pencil-square-o',
  },
  OWN: {
    list: 'ownHearings',
    isFetching: false,
    params: {},
    formattedMessage: 'ownHearings',
    iconName: 'user',
    role: 'link',
  },
};

export default HearingLists;

export const AdminFilters = [HearingLists.PUBLISHED, HearingLists.QUEUE, HearingLists.DRAFTS, HearingLists.OWN];