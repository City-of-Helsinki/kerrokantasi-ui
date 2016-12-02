import _ from 'lodash';


const specialSectionTypes = ["main", "closure-info"];

export function isSpecialSectionType(sectionType) {
  return (specialSectionTypes.includes(sectionType));
}


export function userCanComment(user, section) {
  return section.commenting === "open" || (section.commenting === "registered" && user !== null);
}


export function userCanVote(user, section) {
  return section.voting === "open" || (section.voting === "registered" && user !== null);
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
  return _.merge({
    id: "",
    type: "",
    commenting: "none",
    published: false,
    title: "",
    abstract: "",
    content: "",
    created_at: "",
    created_by: null,
    images: [initNewSectionImage()],
    n_comments: 0,
    plugin_identifier: "",
    plugin_data: "",
    type_name_singular: "",
    type_name_plural: "",
    hearing: ""
  }, inits || {});
}

export function initNewSectionImage() {
  return {
    caption: "",
    height: null,
    title: "",
    url: "",
    width: null,
  };
}
