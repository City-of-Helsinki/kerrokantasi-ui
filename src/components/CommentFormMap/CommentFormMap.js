import React from 'react';
import PropTypes from 'prop-types';
import {Map, TileLayer, FeatureGroup} from "react-leaflet";
import Leaflet from 'leaflet';
import {EditControl} from 'react-leaflet-draw';

import leafletMarkerIconUrl from '../../../assets/images/leaflet/marker-icon.png';
import leafletMarkerShadowUrl from '../../../assets/images/leaflet/marker-shadow.png';
import leafletMarkerRetinaIconUrl from '../../../assets/images/leaflet/marker-icon-2x.png';
import getTranslatedTooltips from "../../utils/getTranslatedTooltips";


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
  [59.925305, 27.727841]
];
class CommentFormMap extends React.Component {
  componentDidMount() {
    Leaflet.drawLocal = getTranslatedTooltips(this.props.language);
  }

  componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      Leaflet.drawLocal = getTranslatedTooltips(this.props.language);
    }
  }

  /**
   * If a city-specific configuration is installed and coordinates are passed to this component then they are used.
   * Default is to use the default coordinates DEFAULT_BOUNDS
   * @returns {number[][]|Array}
   */
  getMapBounds() {
    if (this.props.mapBounds === null) {
      return DEFAULT_BOUNDS;
    }
    return this.props.mapBounds;
  }

  render() {
    const {onDrawCreate, onDrawDelete, tools} = this.props;
    // below checks if all commenting map tools are enabled in this section
    // if enabled then rectangle and polygon tools are also available in addition to the marker
    const allToolsEnabled = tools === 'all';
    return (
      <Map
        center={this.props.center}
        scrollWheelZoom={false}
        zoom={15}
        maxZoom={18}
        minZoom={11}
        style={{height: 300, width: '100%'}}
        maxBounds={(this.getMapBounds())}
      >
        <TileLayer
          url={this.props.mapTileUrl}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup
          ref={(input) => {
            if (!input) return;
            const bounds = input.leafletElement.getBounds();
            if (bounds.isValid()) {
              input.context.map.fitBounds(bounds);
            }
          }}
        >
          {this.props.contents !== null && (
            <div>{this.props.contents}</div>
          )}
          <EditControl
            position="topleft"
            onCreated={onDrawCreate}
            onDeleted={onDrawDelete}
            draw={{
              circle: false,
              circlemarker: false,
              polyline: false,
              polygon: allToolsEnabled,
              rectangle: allToolsEnabled,
              marker: {
                icon: new Leaflet.Icon({
                  iconUrl: leafletMarkerIconUrl,
                  shadowUrl: leafletMarkerShadowUrl,
                  iconRetinaUrl: leafletMarkerRetinaIconUrl,
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                })
              }}}
            edit={{
              edit: false,
            }}
          />
        </FeatureGroup>
      </Map>
    );
  }
}
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
