/* eslint-disable sonarjs/todo-tag */
/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable sonarjs/no-uniq-key */
import React from 'react';
import L, { LatLng } from 'leaflet';
import { Polygon, GeoJSON, Marker, Polyline } from 'react-leaflet';

import 'proj4'; // import required for side effect
import 'proj4leaflet'; // import required for side effect
import leafletMarkerIconUrl from '../../assets/images/leaflet/marker-icon.png';
import leafletMarkerRetinaIconUrl from '../../assets/images/leaflet/marker-icon-2x.png';
import leafletMarkerShadowUrl from '../../assets/images/leaflet/marker-shadow.png';

/**
 * Returns high contrast map tiles url if the url exists and if high contrast setting is on,
 * otherwise returns normal map tiles url.
 * @param {string} normalMapTilesUrl
 * @param {string} highContrastMapTilesUrl
 * @param {boolean} isHighContrastEnabled
 * @param {('fi'|'sv')} language
 */
export function getCorrectContrastMapTileUrl(
  normalMapTilesUrl,
  highContrastMapTilesUrl,
  isHighContrastEnabled,
  language
) {
  // en -> fi
  const styleLanguage = ['fi', 'sv'].includes(language) ? language : 'fi';

  if (isHighContrastEnabled && highContrastMapTilesUrl) {
    return highContrastMapTilesUrl.replace(/{language}/, styleLanguage);
  }
  return normalMapTilesUrl.replace(/{language}/, styleLanguage);
}

/**
 * HearingFormStep3 implementation
 * Returns map elements according to geojson.type
 * @param {object} geojson
 * @returns {JSX.Element|*}
 */
export function getMapElement(geojson) {
  if (!geojson || !geojson.type) {
    return null;
  }

  switch (geojson.type) {
    case 'Polygon': {
      // XXX: This only supports the _first_ ring of coordinates in a Polygon
      const latLngs = geojson.coordinates[0].map(
        ([lng, lat]) => new LatLng(lat, lng)
      );
      return <Polygon key={Math.random()} positions={latLngs} />;
    }
    case 'MultiPolygon': {
      const latLngs = geojson.coordinates.map((arr) =>
        arr[0].map(([lng, lat]) => new LatLng(lat, lng))
      );
      return latLngs.map((latLngItem) => (
        <Polygon key={latLngItem} positions={latLngItem} />
      ));
    }
    case 'Point': {
      const latLngs = new LatLng(
        geojson.coordinates[1],
        geojson.coordinates[0]
      );
      return (
        <Marker
          key={Math.random()}
          position={latLngs}
          icon={
            new L.Icon({
              iconUrl: leafletMarkerIconUrl,
              shadowUrl: leafletMarkerShadowUrl,
              iconRetinaUrl: leafletMarkerRetinaIconUrl,
              iconSize: [25, 41],
              iconAnchor: [13, 41],
            })
          }
        />
      );
    }
    case 'LineString': {
      const latLngs = geojson.coordinates.map(
        ([lng, lat]) => new LatLng(lat, lng)
      );
      return <Polyline positions={latLngs} />;
    }
    case 'Feature': {
      /**
       * Recursively get the map element
       * @example
       * geojson = {type: 'Feature', geometry:{type: 'Point', coordinates: [...]}}
       */
      return getMapElement(geojson.geometry);
    }
    case 'FeatureCollection': {
      const { features } = geojson;
      const elementCollection = features.reduce((accumulator, currentValue) => {
        accumulator.push(getMapElement(currentValue));
        return accumulator;
      }, []);
      return [...elementCollection];
    }
    default:
      // TODO: Implement support for other geometries too (markers, square, circle)
      return <GeoJSON data={geojson} key={JSON.stringify(geojson)} />;
  }
}
