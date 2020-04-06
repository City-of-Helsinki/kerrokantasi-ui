import { find, values, merge } from 'lodash';
// import uuid from 'uuid/v1';

import initAttr from './initAttr';
import {acceptsComments} from "./hearing";
import {isAdmin} from "./user";

export const SectionTypes = {
  MAIN: 'main',
  CLOSURE: 'closure-info',
};

const specialSectionTypes = values(SectionTypes);

export const isMainSection = (section) => {
  return section.type === SectionTypes.MAIN;
};

export function isSpecialSectionType(sectionType) {
  return specialSectionTypes.includes(sectionType);
}

export function userCanComment(user, section) {
  return section.commenting === 'open' ||
    (section.commenting === 'registered' && Boolean(user)) ||
    (section.commenting === 'strong' && Boolean(user) && (user.hasStrongAuth || isAdmin(user)));
}

export function userCanVote(user, section) {
  return section.voting === 'open' || (section.voting === 'registered' && Boolean(user));
}

export function isSectionVotable(hearing, section, user) {
  return acceptsComments(hearing) && userCanVote(user, section);
}

export function isSectionCommentable(hearing, section, user) {
  return (
    acceptsComments(hearing)
      && userCanComment(user, section)
      && !section.plugin_identifier // comment box not available for sections with plugins
  );
}

/**
 * Returns boolean based on if
 * user can comment and commenting_map_tools are enabled on the section
 * @param {object} user
 * @param {object} section
 * @returns {boolean}
 */
export function isSectionCommentingMapEnabled(user, section) {
  return (
    userCanComment(user, section)
    && section.commenting_map_tools !== 'none'
  );
}

/**
 * Returns message id that is used in
 * the 'write a comment' button on a hearing.
 * @param {object} section
 * @returns {string} id
 */
export function getSectionCommentingErrorMessage(section) {
  return section.commenting === 'strong' ? 'commentStrongRegisteredUsersOnly' : 'loginToComment';
}

/**
 * Returns the message id that is used in
 * <FormattedMessage id={return} />
 * @param {object} section
 * @returns {string} id
 */
export function getSectionCommentingMessage(section) {
  switch (section.commenting) {
    case "open": {
      return 'openCommenting';
    }
    case "registered": {
      return 'commentRegisteredUsersOnly';
    }
    case "strong": {
      return 'commentStrongRegisteredUsersOnly';
    }
    case "none": {
      return 'noCommenting';
    }
    default: {
      return 'openCommenting';
    }
  }
}

/**
 * Get the "main" image of given section.
 * As long as only one image per section is supported this "main" image
 * is the first and only image in the images list.
 * Return empty object if no image could be found.
 * @param  {object} section
 * @return {object} object representing the image
 */
export function getMainImage(section) {
  return section.images[0] || {};
}

/*
Return initialized section object.
@return {object}
 */
export function initNewSection(inits) {
  return merge(
    {
      id: '',
      type: '',
      commenting: 'open',
      commenting_map_tools: 'none',
      title: initAttr(),
      abstract: initAttr(),
      content: initAttr(),
      created_at: '',
      created_by: null,
      images: [],
      files: [],
      n_comments: 0,
      plugin_identifier: '',
      plugin_data: '',
      type_name_singular: '',
      type_name_plural: '',
      hearing: '',
      questions: []
    },
    inits || {},
  );
}

export function initNewSectionImage() {
  return {
    caption: initAttr(),
    height: null,
    title: initAttr(),
    url: '',
    width: null,
  };
}

export function groupSections(sections) {
  const sectionGroups = [];
  sections.forEach(section => {
    const sectionGroup = find(sectionGroups, group => section.type === group.type);
    if (sectionGroup) {
      sectionGroup.sections.push(section);
      sectionGroup.n_comments += section.n_comments;
    } else {
      sectionGroups.push({
        name_singular: section.type_name_singular,
        name_plural: section.type_name_plural,
        type: section.type,
        sections: [section],
        n_comments: section.n_comments,
      });
    }
  });
  return sectionGroups;
}

export function getSectionURL(hearingSlug, section) {
  return `/${hearingSlug}/${section.id}`;
}
