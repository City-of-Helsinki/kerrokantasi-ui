const specialSectionTypes = ["introduction", "closure info"];

export function isSpecialSectionType(sectionType) {
  return (specialSectionTypes.includes(sectionType));
}
