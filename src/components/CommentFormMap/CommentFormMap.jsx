import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import Leaflet from 'leaflet';
import { EditControl } from 'react-leaflet-draw';

import leafletMarkerIconUrl from '../../../assets/images/leaflet/marker-icon.png';
import leafletMarkerShadowUrl from '../../../assets/images/leaflet/marker-shadow.png';
import leafletMarkerRetinaIconUrl from '../../../assets/images/leaflet/marker-icon-2x.png';
import getTranslatedTooltips from '../../utils/getTranslatedTooltips';

/**
 * If a city-specific configuration is in use then
 * the coordinates are imported from @city-i18n/localization.json to BaseCommentForm.js and passed to this component.
 * This holds the default coordinates that are used to draw
 * the rectangle that defines the boundaries of the map.
 * [[coordinates to top left corner],[coordinates to bottom right corner]]
 * https://leafletjs.com/reference-1.6.0.html#map-maxbounds
 */
const DEFAULT_BOUNDS = [
  [61.930637, 20.685796],
  [59.925305, 27.727841],
];

const CommentFormMap = ({
  center,
  mapTileUrl,
  mapBounds,
  onDrawCreate,
  onDrawDelete,
  contents,
  tools,
  language,
}) => {
  useEffect(() => {
    Leaflet.drawLocal = getTranslatedTooltips(language);
  }, [language]);

  const bounds = mapBounds ?? DEFAULT_BOUNDS;
  const allToolsEnabled = tools === 'all';

  return (
    <MapContainer
      center={center}
      scrollWheelZoom={false}
      zoom={15}
      maxZoom={18}
      minZoom={11}
      style={{ height: 300, width: '100%' }}
      maxBounds={bounds}
    >
      <TileLayer
        url={mapTileUrl}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup>
        {contents !== null && <div>{contents}</div>}
        <EditControl
          position='topleft'
          onCreated={onDrawCreate}
          onDeleted={onDrawDelete}
          draw={{
            circle: false,
            circlemarker: false,
            polyline: false,
            polygon: allToolsEnabled,
            rectangle: allToolsEnabled ? { showArea: false } : false,
            marker: {
              icon: new Leaflet.Icon({
                iconUrl: leafletMarkerIconUrl,
                shadowUrl: leafletMarkerShadowUrl,
                iconRetinaUrl: leafletMarkerRetinaIconUrl,
                iconSize: [25, 41],
                iconAnchor: [13, 41],
              }),
            },
          }}
          edit={{
            edit: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

CommentFormMap.propTypes = {
  center: PropTypes.object,
  mapTileUrl: PropTypes.string,
  mapBounds: PropTypes.array,
  onDrawCreate: PropTypes.func,
  onDrawDelete: PropTypes.func,
  contents: PropTypes.any,
  tools: PropTypes.string,
  language: PropTypes.string,
};

export default CommentFormMap;
