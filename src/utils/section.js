const specialSectionTypes = ["main", "closure-info"];

export function isSpecialSectionType(sectionType) {
  return (specialSectionTypes.includes(sectionType));
}
