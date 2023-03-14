/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import {getHearingURL} from '../utils/hearing';
import getAttr from '../utils/getAttr';
import Leaflet, { LatLng } from 'leaflet';
import { Polygon, Marker, Polyline, Map, TileLayer, FeatureGroup, Popup, GeoJSON } from 'react-leaflet';
import { connect } from 'react-redux';

import leafletMarkerIconUrl from '../../assets/images/leaflet/marker-icon.png';
import leafletMarkerRetinaIconUrl from '../../assets/images/leaflet/marker-icon-2x.png';
import leafletMarkerShadowUrl from '../../assets/images/leaflet/marker-shadow.png';
/* eslint-disable import/no-unresolved */
import localization from '@city-i18n/localization.json';
import urls from '@city-assets/urls.json';
import { getCorrectContrastMapTileUrl } from '../utils/map';
/* eslint-enable import/no-unresolved */

class OverviewMap extends React.Component {
  state = {
    height: this.props.showOnCarousel ? null : this.props.style.height,
    width: this.props.showOnCarousel ? null : this.props.style.width,
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  }

  componentWillReceiveProps = (nextProps) => {
    if (
      nextProps.mapContainer
      && typeof nextProps.mapContainer !== 'undefined'
      && nextProps.mapContainer.getBoundingClientRect()) {
      this.handleUpdateMapDimensions(nextProps.mapContainer);
    }
  }

  updateDimensions = () => {
    this.handleUpdateMapDimensions(this.props.mapContainer);
  }

  /**
   * The react-leaflet requires static width and height to display properly, attach listener.
   * @param {Object} mapContainer - Container enclosing the map
   */
  handleUpdateMapDimensions = (mapContainer) => {
    if (mapContainer) {
      const { width, height } = mapContainer.getBoundingClientRect();
      if (width > 0 && height > 0) {
        this.setState({ width: `${width}px`, height: `${height}px`});
      }
    }
  }

  /**
   * ensures whether it is the right time to render map.
   * In case of carousel, we require static width and height.
   * @returns {Bool}
   */
  shouldMapRender = () => (
    this.props.showOnCarousel ? (this.state.height && this.state.width) : true
  );


  getHearingMapContent(hearings) {
    const contents = [];
    hearings.forEach((hearing) => {
      /* eslint-disable-next-line no-unused-vars */
      const {geojson, id} = hearing;

      if (geojson) {
        const mapElement = this.getMapElement(hearing);
        if (Array.isArray(mapElement) && mapElement.length > 0) {
          mapElement.forEach(mapEl => {
            contents.push(mapEl);
          });
        } else if (mapElement && !Array.isArray(mapElement)) {
          contents.push(mapElement);
        }
      }
    });
    return contents;
  }

  /**
   * Return Map element based on geojson.type.
   * @param {Object} geojson
   * @param {Object} hearing
   * @returns {JSX.Element|*}
   */
  getMapElement(hearing) {
    const {mapElementLimit} = this.props;
    const {geojson, id} = hearing;
    if (geojson) {
      switch (geojson.type) {
        case "Polygon": {
          // XXX: This only supports the _first_ ring of coordinates in a Polygon
          const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
          return (
            <Polygon
              key={id + "" + Math.random()}
              positions={latLngs}
            >
              {this.getPopupContent(hearing, geojson)}
            </Polygon>);
        }
        case "Point": {
          const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
          return (
            <Marker
              position={latLngs}
              key={id + "" + Math.random()}
              icon={new Leaflet.Icon({
                iconUrl: leafletMarkerIconUrl,
                shadowUrl: leafletMarkerShadowUrl,
                iconRetinaUrl: leafletMarkerRetinaIconUrl,
                iconSize: [25, 41],
                iconAnchor: [13, 41]
              })}
              {...this.getAdditionalParams(hearing)}
            >{this.getPopupContent(hearing, geojson)}
            </Marker>
          );
        }
        case "LineString": {
          const latLngs = geojson.coordinates.map(([lng, lat]) => new LatLng(lat, lng));
          return (
            <Polyline key={id + "" + Math.random()} positions={latLngs}>
              {this.getPopupContent(hearing, geojson)}
            </Polyline>
          );
        }
        case "FeatureCollection": {
          // if mapElementLimit is true & more than 0, display up to that amount of elements
          const mapElementArray = [];
          if (mapElementLimit && mapElementLimit > 0) {
            geojson.features.slice(0, mapElementLimit).forEach((feature) => {
              mapElementArray.push(this.getMapElement(feature, hearing));
            });
          } else {
            // if mapElementLimit is false -> display all elements found in FeatureCollection
            geojson.features.forEach((feature) => {
              mapElementArray.push(this.getMapElement(feature, hearing));
            });
            return mapElementArray;
          }
        }
          break;
        case "Feature": {
          /**
           * Recursively get the Map element
           */
          return (this.getMapElement(geojson.geometry, hearing));
        }
        default:
          // TODO: Implement support for other geometries too (markers, square, circle)
          return (
            <GeoJSON data={geojson} key={id + "" + Math.random()}>{this.getPopupContent(hearing, geojson)}</GeoJSON>
          );
      }
    }
    return [];
  }

  /**
   * Return Popup with content based on hearing. If geojson.type is 'Point', apply offset to Popup
   * @param {Object} hearing
   * @param {Object} geojson
   * @returns {JSX.Element|null}
   */
  getPopupContent(hearing, geojson) {
    const {language} = this.context;
    const {enablePopups} = this.props;
    // offset added in order to open the popup window from the middle of the Marker instead of the default bottom.
    const options = geojson.type === 'Point' ? {offset: [0, -20]} : {};
    if (enablePopups) {
      const hearingURL = getHearingURL(hearing) + document.location.search;
      return (
        <Popup {...options}>
          <div>
            <h4>
              <a href={hearingURL}>{getAttr(hearing.title, language)}</a>
            </h4>
            <p>{getAttr(hearing.abstract, language)}</p>
          </div>
        </Popup>
      );
    }
    return null;
  }

  /**
   * Returns additional parameters for Markers.
   *
   * If enablePopups is true then return params that enable tabIndex and correct alt text.
   *
   * Otherwise return params that disable tabIndex
   * @param {Object} hearing
   * @returns {{alt: *}|{keyboard: boolean}}
   */
  getAdditionalParams(hearing) {
    const {enablePopups} = this.props;
    const {language} = this.context;
    if (enablePopups) {
      return {alt: getAttr(hearing.title, language)};
    }
    return {keyboard: false};
  }

  render() {
    if (typeof window === "undefined") return null;
    const { hearings} = this.props;
    const contents = this.getHearingMapContent(hearings);
    if (!contents.length && this.props.hideIfEmpty) {
      return null;
    }
    return (
      this.shouldMapRender() &&
      <Map
        center={localization.mapPosition}
        zoom={10}
        style={{ ...this.state }}
        minZoom={8}
        scrollWheelZoom={false}
        {...this.props.mapSettings}
      >
        <TileLayer
          url={getCorrectContrastMapTileUrl(urls.rasterMapTiles,
            urls.highContrastRasterMapTiles, this.props.isHighContrast, this.context.language)}
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
          <div>{contents}</div>
        </FeatureGroup>
      </Map>);
  }
}

const mapStateToProps = (state) => ({
  isHighContrast: state.accessibility.isHighContrast,
});

OverviewMap.defaultProps = {
  mapElementLimit: 0,
};

OverviewMap.propTypes = {
  enablePopups: PropTypes.bool,
  hearings: PropTypes.array.isRequired,
  hideIfEmpty: PropTypes.bool,
  isHighContrast: PropTypes.bool,
  mapContainer: PropTypes.object,
  mapElementLimit: PropTypes.number,
  mapSettings: PropTypes.object,
  showOnCarousel: PropTypes.bool,
  style: PropTypes.object,
};

OverviewMap.contextTypes = {
  language: PropTypes.string.isRequired,
};

OverviewMap.defaultProps = {
  showOnCarousel: false,
  mapContainer: undefined,
};

export default connect(mapStateToProps, null)(OverviewMap);
