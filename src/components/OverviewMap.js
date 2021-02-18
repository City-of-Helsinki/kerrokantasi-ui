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

  getMapElement(geojson, content) {
    switch (geojson.type) {
      case "Polygon": {
        // XXX: This only supports the _first_ ring of coordinates in a Polygon
        const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
        return (<Polygon key={Math.random()} positions={latLngs}>{content}</Polygon>);
      }
      case "Point": {
        const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
        return (
          <Marker
            position={latLngs}
            key={Math.random()}
            icon={new Leaflet.Icon({
              iconUrl: leafletMarkerIconUrl,
              shadowUrl: leafletMarkerShadowUrl,
              iconRetinaUrl: leafletMarkerRetinaIconUrl,
              iconSize: [25, 41],
              iconAnchor: [13, 41]
            })}
          />
        );
      }
      case "LineString": {
        const latLngs = geojson.coordinates.map(([lng, lat]) => new LatLng(lat, lng));
        return (<Polyline key={Math.random()} positions={latLngs}>{content}</Polyline>);
      }
      case "Feature": {
        return (this.getMapElement(geojson.geometry, content));
      }
      default:
        // TODO: Implement support for other geometries too (markers, square, circle)
        return (<GeoJSON data={geojson} key={JSON.stringify(geojson)}>{content}</GeoJSON>);
    }
  }

  getHearingMapContent(hearings) {
    const {language} = this.context;
    const contents = [];

    hearings.forEach((hearing) => {
      const {geojson, id} = hearing;
      const content = (
        this.props.enablePopups ? (
          <Popup>
            <div>
              <h4>
                <a href={getHearingURL(hearing)}>{getAttr(hearing.title, language)}</a>
              </h4>
              <p>{getAttr(hearing.abstract, language)}</p>
            </div>
          </Popup>
        ) : null
      );

      if (geojson) {
        switch (geojson.type) {
          case "Polygon": {
            // XXX: This only supports the _first_ ring of coordinates in a Polygon
            const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
            contents.push(<Polygon key={Math.random()} positions={latLngs}>{content}</Polygon>);
          }
            break;
          case "Point": {
            const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
            contents.push(
              <Marker
                position={latLngs}
                key={Math.random()}
                icon={new Leaflet.Icon({
                  iconUrl: leafletMarkerIconUrl,
                  shadowUrl: leafletMarkerShadowUrl,
                  iconRetinaUrl: leafletMarkerRetinaIconUrl,
                  iconSize: [25, 41],
                  iconAnchor: [13, 41]
                })}
              />
            );
          }
            break;
          case "LineString": {
            const latLngs = geojson.coordinates.map(([lng, lat]) => new LatLng(lat, lng));
            contents.push(<Polyline key={Math.random()} positions={latLngs}>{content}</Polyline>);
          }
            break;
          // eslint-disable-next-line no-lone-blocks
          case "FeatureCollection": {
            if (this.props.disableCollections) {
              contents.push(this.getMapElement(geojson.features[0].geometry, content));
            } else {
              geojson.features.forEach((feature) => {
                contents.push(this.getMapElement(feature, content));
              });
            }
          }
            break;
          default:
          // TODO: Implement support for other geometries too (markers, square, circle)
            contents.push(<GeoJSON data={geojson} key={JSON.stringify(geojson)}>{content}</GeoJSON>);
        }
        // contents.push(<GeoJSON key={id} data={geojson}>{content}</GeoJSON>);
      }
    });
    return contents;
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
      <Map center={localization.mapPosition} zoom={10} style={{ ...this.state }} minZoom={8} scrollWheelZoom={false} {...this.props.mapSettings}>
        <TileLayer
          url={getCorrectContrastMapTileUrl(urls.rasterMapTiles,
            urls.highContrastRasterMapTiles, this.props.isHighContrast)}
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
  disableCollections: false,
};

OverviewMap.propTypes = {
  hearings: PropTypes.array.isRequired,
  style: PropTypes.object,
  hideIfEmpty: PropTypes.bool,
  enablePopups: PropTypes.bool,
  disableCollections: PropTypes.bool,
  showOnCarousel: PropTypes.bool,
  mapContainer: PropTypes.object,
  isHighContrast: PropTypes.bool,
  mapSettings: PropTypes.object,
};

OverviewMap.contextTypes = {
  language: PropTypes.string.isRequired,
};

OverviewMap.defaultProps = {
  showOnCarousel: false,
  mapContainer: undefined,
};

export default connect(mapStateToProps, null)(OverviewMap);
