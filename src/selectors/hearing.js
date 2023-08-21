import { head, isEmpty } from 'lodash';

import { SectionTypes } from '../utils/section';

export const getTopHearing = (state) =>
  state.hearingLists.topHearing && state.hearingLists.topHearing.data && head(state.hearingLists.topHearing.data);

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
  const comments = state.sectionComments[state.hearing[hearingSlug].data.sections
    .find(sec => sec.type === SectionTypes.MAIN).id];
  if (!comments) return undefined;
  return comments;
};

/**
 * Returns value at state.hearingLists[type][key]
 * @param {Object} state
 * @param {string} type
 * @param {string} key
 * @returns {*}
 */
export const getHearingValue = (state, type, key) =>
  state.hearingLists[type][key];

/**
 * @typedef {Object} returnObject
 * @property {number|string|Object} open - hearings that are open
 * @property {number|string|Object} closed - hearings that are closed
 * @property {number|string|Object} draft - hearings that are drafts
 */

/**
 * Return object with keys open, closed and draft
 * with values from getHearingValue according to key.
 * @param {Object} state
 * @param {string} key
 * @returns {returnObject}
 * @see getHearingValue
 */
export const getUserHearingList = (state, key) => ({
  open: getHearingValue(state, 'userHearingsOpen', key),
  queue: getHearingValue(state, 'userHearingsQueue', key),
  closed: getHearingValue(state, 'userHearingsClosed', key),
  draft: getHearingValue(state, 'userHearingsDrafts', key),
});
