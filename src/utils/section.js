import _, {find} from 'lodash';


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
    commenting: "",
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
    height: "",
    title: "",
    url: "",
    width: "",
  };
}

export function groupSections(sections) {
  const sectionGroups = [];
  sections.forEach((section) => {
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
  return `/hearing/${hearingSlug}/${section.id}`;
}
