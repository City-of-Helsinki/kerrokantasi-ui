import {head, isEmpty} from 'lodash';
import {SectionTypes} from '../utils/section';

export const getTopHearing = (state) =>
  state.hearingLists.topHearing && state.hearingLists.topHearing.data && head(state.hearingLists.topHearing.data);

// eslint-disable-next-line
export const getOpenHearings = (state) =>
  state.hearingLists.openHearings;

export const getHearingWithSlug = (state, hearingSlug) => {
  if (state.hearing[hearingSlug]) {
    return state.hearing[hearingSlug].data || {};
  }
  return {};
};

export const getSection = (state, hearingSlug, sectionId) => {
  if (!state.hearing[hearingSlug]) return undefined;
  return state.hearing[hearingSlug].data.sections.find(section => section.id === sectionId);
};

export const getSections = (state, hearingSlug) => {
  if (!state.hearing[hearingSlug]) return undefined;
  return state.hearing[hearingSlug].data.sections;
};

export const getIsHearingClosed = (state, hearingSlug) => {
  if (!state.hearing[hearingSlug]) return undefined;
  return state.hearing[hearingSlug].data.closed;
};

export const getIsHearingPublished = (state, hearingSlug) => {
  if (!state.hearing[hearingSlug]) return undefined;
  return state.hearing[hearingSlug].data.published;
};

export const getHearingContacts = (state, hearingSlug) => {
  if (!state.hearing[hearingSlug]) return undefined;
  return state.hearing[hearingSlug].data.contact_persons;
};

export const getMainSection = (state, hearingSlug) => {
  if (!state.hearing[hearingSlug] || isEmpty(state.hearing[hearingSlug].data)) return undefined;
  return state.hearing[hearingSlug].data.sections.find(section => section.type === SectionTypes.MAIN);
};

export const getSectionCommentsById = (state, sectionId) => {
  if (isEmpty(state.sectionComments[sectionId])) return undefined;
  return state.sectionComments[sectionId];
};

export const getMainSectionComments = (state, hearingSlug) => {
  if (!state.hearing[hearingSlug] || isEmpty(state.hearing[hearingSlug].data)) return undefined;
  const comments = state.sectionComments[state.hearing[hearingSlug].data.sections.find(sec => sec.type === SectionTypes.MAIN).id];
  if (!comments) return undefined;
  return comments;
};
