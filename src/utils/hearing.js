import _ from 'lodash';
import {initNewSection} from './section';


export function getClosureSection(hearing) {
  return _.find(hearing.sections, (section) => section.type === "closure-info");
}


export function getMainSection(hearing) {
  return _.find(hearing.sections, (section) => section.type === "main");
}


/*
* Return URL to hearing view. Accepts optional fullscreen parameter
* to force fullscreen query parameter.
 */
export function getHearingURL(hearing, {fullscreen} = {}) {
  const url = `/hearing/${hearing.slug}`;
  let query = "";
  if (typeof fullscreen !== "undefined") {
    query = `?fullscreen=${fullscreen}`;
  } else if (hearing.default_to_fullscreen) {
    // Hearing should always have default_to_fullscreen param
    query = "?fullscreen=true";
  }
  return `${url}${query}`;
}

export function getHearingMainImageURL(hearing) {
  return _.get(hearing, 'main_image.url');
}


/*
* Returns true if hearing has a plugin that can be rendered fullscreen
* else false.
 */
export function hasFullscreenMapPlugin(hearing) {
  // For now, fullscreen is supported only on map-questionnaire
  return getMainSection(hearing).plugin_identifier === "map-questionnaire";
}

/*
* Returns true if comments are still accepted for the hearing
* else false.
 */
export function acceptsComments(hearing) {
  return !hearing.closed && (new Date() < new Date(hearing.close_at));
}


/**
 * Get section by given ID or undefined
 * @return {object} Section object
 */
export function getSectionByID(hearing, sectionID) {
  return _.find(hearing.sections, (section) => section.id === sectionID);
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
  mainSection.type = "main";
  return _.merge({
    abstract: "",
    title: "",
    slug: "",
    labels: [],
    published: false,
    open_at: null,
    close_at: null,
    sections: [mainSection],
    main_image: {},
    contact_persons: [],
    n_comments: 0
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
  return Boolean(user && _.includes(user.adminOrganizations || [], hearing.organization));
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
