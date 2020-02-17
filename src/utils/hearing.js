import {get, find, merge, includes} from 'lodash';
import moment from 'moment';

import { initNewSection, SectionTypes, userCanComment } from './section';
import initAttr from './initAttr';
import getAttr from './getAttr';
import i18n from '../i18n';

export function getClosureSection(hearing) {
  return find(hearing.sections, (section) => section.type === SectionTypes.CLOSURE);
}


export function getMainSection(hearing) {
  return find(hearing.sections, (section) => section.type === SectionTypes.MAIN);
}


/*
* Return URL to hearing view. Accepts optional fullscreen parameter
* to force fullscreen query parameter.
 */
export function getHearingURL(hearing, {fullscreen} = {}) {
  const url = `/${hearing.slug}${fullscreen || hearing.default_to_fullscreen ? '/fullscreen' : ''}`;
  return url;
}

export function getHearingMainImageURL(hearing) {
  return get(hearing, 'main_image.url');
}

/*
* Returns true if hearing has a plugin that can be rendered fullscreen
* else false.
 */
export function hasFullscreenMapPlugin(hearing) {
  // Legacy plugins actually do not support full screen
  const identifier = getMainSection(hearing).plugin_identifier;
  return identifier !== null && identifier !== '' && identifier !== 'mapdon-hkr' && identifier !== 'mapdon-ksv';
}

/*
* Returns true if comments are still accepted for the hearing
* else false.
 */
export function acceptsComments(hearing) {
  return !hearing.closed && (new Date() < new Date(hearing.close_at));
}

/*
* Returns true if any of the sections in a hearing has commenting enabled or if the hearing has a plugin
* else false.
 */
export function hasCommentableSections(hearing, sections, user) {
  return sections.some((elem) => userCanComment(user, elem)) || getMainSection(hearing).plugin_identifier;
}

/*
 * Returns true if the hearing is visible to everybody.
 */
export function isPublic(hearing) {
  const openAt = moment(hearing.open_at);
  if (openAt.isValid()) {
    const now = moment();
    if (openAt <= now && hearing.published) {
      return true;
    }
  }
  return false;
}

/**
 * Get section by given ID or undefined
 * @return {object} Section object
 */
export function getSectionByID(hearing, sectionID) {
  return find(hearing.sections, (section) => section.id === sectionID);
}

/**
 * Get section by given ID or create a new section if hearing didn't
 * have section with given ID.
 * @return {object} Section object
 */
export function getOrCreateSectionByID(hearing, sectionID) {
  return getSectionByID(hearing, sectionID) || initNewSection({id: sectionID});
}

/*
Return initialized Hearing object representation.
@return {object}
 */
export function initNewHearing(inits) {
  const mainSection = initNewSection();
  mainSection.type = SectionTypes.MAIN;
  const closureSection = initNewSection();
  closureSection.type = SectionTypes.CLOSURE;
  closureSection.content = {
    fi: i18n.fi.defaultClosureInfo || '',
    sv: i18n.sv.defaultClosureInfo || '',
    en: i18n.en.defaultClosureInfo || ''
  };
  return merge({
    abstract: initAttr(),
    title: initAttr(),
    slug: "",
    labels: [],
    published: false,
    open_at: null,
    close_at: null,
    sections: [mainSection, closureSection],
    main_image: {},
    contact_persons: [],
    n_comments: 0,
    isNew: true,
  }, inits || {});
}


/*
Return true if use can edit given hearing.
@param  {object} user
@param  {object} hearing
@return {bool}
 */
export function canEdit(user, hearing) {
  // If the user is an admin of the hearing's organization, allow editing
  if (!user || !hearing) {
    return false;
  }
  return Boolean(user && includes(user.adminOrganizations || [], hearing.organization));
}

export function getImageAsBase64Promise(image) {
  const reader = new FileReader();
  reader.readAsDataURL(image);
  return new Promise(
    (resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
    });
}

export function getOpenGraphMetaData(hearing, language) {
  let hostname = "http://kerrokantasi.hel.fi";
  if (typeof HOSTNAME === 'string') {
    hostname = HOSTNAME;  // eslint-disable-line no-undef
  } else if (typeof window !== 'undefined') {
    hostname = window.location.protocol + "//" + window.location.host;
  }
  const url = hostname + "/" + hearing.slug;
  return [
    {property: "og:url", content: url},
    {property: "og:type", content: "website"},
    {property: "og:title", content: getAttr(hearing.title, language)},
    {property: "og:image", content: get(hearing, 'main_image.url', '')},
    {property: "og:description", content: getAttr(hearing.abstract, language)}
  ];
}
