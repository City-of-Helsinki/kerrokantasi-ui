/* eslint-disable id-length */
import L from 'leaflet';
import 'proj4'; // import required for side effect
import 'proj4leaflet'; // import required for side effect

export function EPSG3067() { // eslint-disable-line
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
  // return `${normalMapTilesUrl.split('.').slice(0, -1).join('.')}@${language}.png`;
  return `${normalMapTilesUrl.split('.').slice(0, -1).join('.')}.png`;
}
