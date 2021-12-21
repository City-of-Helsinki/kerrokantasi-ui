// @flow
import {normalize} from 'normalizr';
import uuid from 'uuid/v1';
import pickBy from 'lodash/pickBy';
import includes from 'lodash/includes';
import {assign, flowRight} from 'lodash';
import updeep from 'updeep';

import {hearingSchema} from '../types';

const ATTR_WITH_FRONT_ID = [
  'sections',
  'labels',
  'contact_persons',
];

export const fillFrontId = (
  obj: {frontId: ?string, id: ?string},
  idGenerator: () => string = uuid
) => (
  {
    ...obj,
    frontId: obj.frontId || obj.id || idGenerator(),
  }
);

export const fillFrontIds = (thingz: Array<Object>, idGenerator: () => string = uuid) =>
  thingz.map((thing) => fillFrontId(thing, idGenerator));

export const normalizeEntitiesByFrontId = (data: Object, entityKey: string, idGenerator: () => string = uuid) =>
  normalize({
    ...data,
    [entityKey]: fillFrontIds(data[entityKey], idGenerator),
  }, hearingSchema).entities[entityKey] || {};

export const normalizeHearing = (hearing: Object) =>
  normalize(hearing, hearingSchema);

export const fillFrontIdsForAttributes = (data: Object, attrKeys: Array<string> = ATTR_WITH_FRONT_ID) => ({
  ...data,
  ...attrKeys.reduce((filled, key) => ({
    ...filled,
    [key]: fillFrontIds(data[key]),
  }), {})
});

export const removeFrontId = (obj: Object) => {
  const result = {...obj};
  delete result.frontId;
  return result;
};

export const filterFrontIds = (thingz: Array<Object>) =>
  thingz.map(removeFrontId);

export const filterFrontIdFromPhases = (data: Object) => {
  const cleanedPhases = data.project.phases.map(phase => {
    if (phase.frontId) return removeFrontId(updeep({id: ''}, phase));
    return phase;
  });
  return updeep({
    project: {
      phases: cleanedPhases
    }
  }, data);
};

export const filterFrontIdsFromAttributes = (data: Object, attrKeys: Array<string> = ATTR_WITH_FRONT_ID) => {
  let filteredPhasesData = data;
  if (data.project && data.project.phases) {
    filteredPhasesData = filterFrontIdFromPhases(data);
  }
  return ({
    ...filteredPhasesData,
    ...attrKeys.reduce((filtered, key) => ({
      ...filtered,
      [key]: filterFrontIds(filteredPhasesData[key]),
    }), {})
  });
};

const filterObjectByLanguages = (object, languages) => pickBy(object, (value, key) => includes(languages, key));

const filterSectionsContentByLanguages = (sections, languages) => {
  return sections.map((section) => assign(
    section,
    {
      abstract: filterObjectByLanguages(section.abstract, languages),
      content: filterObjectByLanguages(section.content, languages),
      images: section.images.map((image) => assign(image, filterObjectByLanguages(image.abstract))),
      title: filterObjectByLanguages(section.title, languages)
    }
  ));
};

export const filterTitleAndContentByLanguage = (data, languages) => assign(
  data,
  {
    abstract: filterObjectByLanguages(data.title, languages),
    main_image: data.main_image
      ? assign(data.main_image, filterObjectByLanguages(data.main_image.caption, languages))
      : null,
    title: filterObjectByLanguages(data.title, languages),
    sections: filterSectionsContentByLanguages(data.sections, languages)
  }
);

export const fillFrontIdsAndNormalizeHearing = flowRight([normalizeHearing, fillFrontIdsForAttributes]);

export const getDocumentOrigin = () => (
  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/`
);

export const moveSubsectionInArray = (array, index, delta) => {
  const newArray = array.slice();
  const newIndex = index + delta;
  if (newIndex < 1 || newIndex === array.length || newIndex === index) {
    return newArray;
  } // Already at the top or bottom, or delta was zero
  const indexes = index < newIndex ? [index, newIndex] : [newIndex, index]; // sort indices by integer value!!!
  newArray.splice(indexes[0], 2, newArray[indexes[1]], newArray[indexes[0]]);
  // Replace from lowest index, two elements, reverting the order
  return newArray;
};

export const initNewPhase = () => {
  return {
    frontId: uuid(),
    has_hearings: false,
    hearings: [],
    is_active: false,
    title: {},
    description: {},
    schedule: {}
  };
};

export const initNewProject = () => {
  return {
    id: '',
    title: {},
    phases: []
  };
};


/**
 * Parse through geojson features and round each coordinate to 6 decimals
 * @example
 * [22.3061943054, 60.4597569477] -> [22.306194, 60.459757]
 * @param {Object} featureCollection
 * @param {string} featureCollection.type
 * @param {Object[]} featureCollection.features
 * @returns {{type: string, features: Object[]}}
 */
export const parseCollection = (featureCollection) => {
  const normalizedFeatures = featureCollection.features.reduce((features, feature) => {
    let normalizedCoordinates;
    if (feature.geometry.coordinates.length === 1) {
      /**
       * geometry.coordinates is a multidimensional array - a Polygon
       * e.g. coordinates =
       * [
       *  [
       *  [22.264..., 60.437...],
       *  [22.265..., 60.438...],
       *  [22.266..., 60.439...],
       *  [22.267..., 60.440...]
       *  ...
       *  ]
       * ]
       */
      // coordsToLatLngs - create multidimensional array of LatLngs from GeoJSON coordinates array
      normalizedCoordinates = window.L.GeoJSON.coordsToLatLngs(feature.geometry.coordinates, 1);
      // latLngsToCoords - reverse of the above, precision of the coordinates is 6 decimals
      normalizedCoordinates = window.L.GeoJSON.latLngsToCoords(normalizedCoordinates, 1);
    } else {
      /**
       * geometry.coordinates is an array with multiple values - a Point
       * e.g. coordinates = [22.264...,60.432...]
       */
      // coordsToLatLng - create a LatLng object from array of 2 numbers
      normalizedCoordinates = window.L.GeoJSON.coordsToLatLng(feature.geometry.coordinates);
      // latLngToCoords - reverse of the above, precision of the coordinates is set to 6 decimals
      normalizedCoordinates = window.L.GeoJSON.latLngToCoords(normalizedCoordinates, 6);
    }
    features.push({
      type: feature.type,
      geometry: {
        coordinates: normalizedCoordinates,
        type: feature.geometry.type
      }
    });
    return features;
  }, []);
  return {type: featureCollection.type, features: normalizedFeatures};
};

export const cleanHearing = (hearing) => {
  let cleanedHearing = {};
  if (hearing.geojson && hearing.geojson.type === 'FeatureCollection' && hearing.geojson.features.length === 1) {
    /**
     * If the features array only has 1 feature then we just send that features geometry
     * @example
     * {
     * type: 'FeatureCollection',
     * features: [ {type: 'Feature', geometry:{type:'Point',coordinates:[...]} } ]
     * }
     * ------
     * {type: 'Point', coordinates: [...]}
     */
    cleanedHearing = Object.assign({}, hearing, {
      sections: hearing.sections.reduce((sections, section) => [...sections, Object.assign({}, section, {id: ''})], []),
      geojson: hearing.geojson.features[0].geometry,
    });
  } else {
    cleanedHearing = Object.assign({}, hearing, {
      sections: hearing.sections.reduce((sections, section) => [...sections, Object.assign({}, section, {id: ''})], []),
      geojson: hearing.geojson
    });
  }
  return cleanedHearing;
};

/**
 * Get validationState for FormGroup elements.
 * If errors contains value with key -> return error
 * @param {object} errors
 * @param {string} key
 * @returns {'error'|null}
 */
export const getValidationState = (errors, key) => {
  return errors[key] ? 'error' : null;
};
