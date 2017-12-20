import findIndex from 'lodash/findIndex';

export const getInitialSlideIndex = (hearing, params) => {
  const sectionsWithoutClosure = hearing.sections.filter((section) => section.type !== 'closure-info');
  let initialSlideIndex = 0;
  if (params.sectionId) {
    initialSlideIndex = findIndex(sectionsWithoutClosure, (section) => section.id === params.sectionId.split('#')[0]);
  }
  if (hearing.geojson) {
    initialSlideIndex += 1;
  }
  return initialSlideIndex;
};

export default null;
