import React from 'react';
import L, { LatLng } from 'leaflet';
import { Polygon, GeoJSON, Marker, Polyline } from 'react-leaflet'; 

import 'proj4'; // import required for side effect
import 'proj4leaflet'; // import required for side effect
import leafletMarkerIconUrl from '../../assets/images/leaflet/marker-icon.png';
import leafletMarkerRetinaIconUrl from '../../assets/images/leaflet/marker-icon-2x.png';
import leafletMarkerShadowUrl from '../../assets/images/leaflet/marker-shadow.png';

export function EPSG3067() {
  const crsName = 'EPSG:3067';
  const projDef = '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
  const bounds = L.bounds(L.point(-548576, 6291456), L.point(1548576, 8388608));
  const originNw = [bounds.min.x, bounds.max.y];
  const crsOpts = {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
    bounds,
    transformation: new L.Transformation(1, -originNw[0], -1, originNw[1])
  };
  return new L.Proj.CRS(crsName, projDef, crsOpts);
}

/**
 * Returns high contrast map tiles url if the url exists and if high contrast setting is on,
 * otherwise returns normal map tiles url.
 * @param {string} normalMapTilesUrl
 * @param {string} highContrastMapTilesUrl
 * @param {boolean} isHighContrastEnabled
 */
export function getCorrectContrastMapTileUrl(
  normalMapTilesUrl,
  highContrastMapTilesUrl,
  isHighContrastEnabled,
  // language, uncomment when language specific map tiles are implemented
) {
  if (isHighContrastEnabled && highContrastMapTilesUrl) {
    // Start using commented return once language specific map tiles are implemented
    // return `${highContrastMapTilesUrl.split('.').slice(0, -1).join('.')}@${language}.png`;
    return `${highContrastMapTilesUrl.split('.').slice(0, -1).join('.')}.png`;
  }
  // Start using commented return once language specific map tiles are implemented
  return `${normalMapTilesUrl.split('.').slice(0, -1).join('.')}.png`;
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
      const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
      return <Polygon key={Math.random()} positions={latLngs} />;
    }
    case 'MultiPolygon': {
      const latLngs = geojson.coordinates.map((arr) => arr[0].map(([lng, lat]) => new LatLng(lat, lng)));
      return latLngs.map((latLngItem) => <Polygon key={latLngItem} positions={latLngItem} />);
    }
    case 'Point': {
      const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
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
      const latLngs = geojson.coordinates.map(([lng, lat]) => new LatLng(lat, lng));
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