const specialSectionTypes = ["main", "closure-info"];

export function isSpecialSectionType(sectionType) {
  return (specialSectionTypes.includes(sectionType));
}

export function userCanComment(user, section) {
  return section.commenting === "open" || (section.commenting === "registered" && user !== null);
}
