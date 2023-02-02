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

/**
 * Checks whether comment form has errors or not. Returns an array of found errors.
 * @param {boolean} imageTooBig is image to too big error
 * @param {string} commentText current comment text value
 * @param {Object} section object containing section data
 * @param {Object} answers object containing section comment answers
 * @param {boolean} isReply is this comment a reply
 * @param {boolean} userAnsweredAllQuestions have all questions been answered already
 * @returns {string[]} an array of error strings
 */
export function checkFormErrors(imageTooBig, commentText, section, answers, isReply, userAnsweredAllQuestions) {
  const hasQuestions = hasAnyQuestions(section);
  const commentRequired = isCommentRequired(hasQuestions, isReply, userAnsweredAllQuestions);
  const commentOrAnswerRequired = hasQuestions;
  const hasAnswers = hasAnyAnswers(answers);
  const errors = [];
  if (imageTooBig) {
    errors.push('imageTooBig');
  }
  if (commentRequired && !commentText.trim()) {
    errors.push('commentRequiredError');
  } else if (commentOrAnswerRequired && !commentText.trim() && !hasAnswers) {
    errors.push('commentOrAnswerRequiredError');
  }

  return errors;
}

/**
 * Tells whether any of the section's questions have been answered or not.
 * @param {Object[]} answers array of question answers
 * @returns {boolean} true when at least one question is answered and false if not
 */
export function hasAnyAnswers(answers) {
  return answers.some(questionAnswers => questionAnswers.answers && questionAnswers.answers.length > 0);
}

/**
 * Tells whether section has any questions or not.
 * @param {Object} section object containing section data
 * @returns {boolean} true when section has atleast one question, false if not
 */
export function hasAnyQuestions(section) {
  return section.questions && section.questions.length > 0;
}

/**
 * Tells whether a non empty comment is required or not for a section.
 * @param {boolean} hasQuestions does the section have questions
 * @param {boolean} isReply is this comment a reply
 * @param {boolean} userAnsweredAllQuestions have all questions been answered already
 * @returns {boolean} true when comment is required, false when not
 */
export function isCommentRequired(hasQuestions, isReply, userAnsweredAllQuestions) {
  return isReply || !hasQuestions || userAnsweredAllQuestions;
}

/**
 * Tells whether it is ok to post an empty comment or not.
 * @param {Object} section object containing section data
 * @param {boolean} hasAnswers are any section questions answered
 * @returns {boolean} true when it is ok to post empty comment and false if not
 */
export function isEmptyCommentAllowed(section, hasAnswers) {
  return hasAnyQuestions(section) && hasAnswers;
}

/**
 * Tells whether given user has answered any questions or not.
 * @param {Object} user object containing user data
 * @returns {boolean} true when user has answered questions, false when not
 */
export function hasUserAnsweredQuestions(user) {
  return !!user && 'answered_questions' in user && user.answered_questions.length > 0;
}

/**
 * Tells whether given user has answered to all of given section's questions or not.
 * @param {Object} user object containing user data
 * @param {Object} section object containing section data
 * @returns {boolean} true when user answered section's all questions, false when not
 */
export function hasUserAnsweredAllQuestions(user, section) {
  if (hasAnyQuestions(section) && hasUserAnsweredQuestions(user)) {
    const {questions} = section;
    const answeredQuestions = user.answered_questions;
    for (let index = 0; index < questions.length; index += 1) {
      if (!answeredQuestions.includes(questions[index].id)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

/**
 * Returns the first unanswered section question or null when there are no
 * unanswered questions.
 * @param {Object} user object containing user data
 * @param {Object} section object containing section data
 * @returns {Object|null} first unanswered question object or null
 */
export function getFirstUnansweredQuestion(user, section) {
  if (hasAnyQuestions(section)) {
    const {questions} = section;
    // anon users and users without answers
    if (!user || !hasUserAnsweredQuestions(user)) {
      return questions[0];
    } else if (hasUserAnsweredQuestions(user)) {
      const answeredQuestions = user.answered_questions;
      for (let index = 0; index < questions.length; index += 1) {
        if (!answeredQuestions.includes(questions[index].id)) {
          return questions[index];
        }
      }
    }
  }
  return null;
}

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
      voting: 'registered',
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
