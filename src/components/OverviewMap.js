/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import {getHearingURL} from '../utils/hearing';
import getAttr from '../utils/getAttr';
import {EPSG3067} from '../utils/map';
import Leaflet from 'leaflet';

class OverviewMap extends React.Component {
  getHearingMapContent(hearings) {
    const {Popup, GeoJSON} = require('react-leaflet');  // Late import to be isomorphic compatible
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
        const {LatLng} = require('leaflet');  // Late import to be isomorphic compatible
        const {Polygon, Marker, Polyline} = require('react-leaflet');  // Late import to be isomorphic compatible
        switch (geojson.type) {
          case "Polygon": {
            // XXX: This only supports the _first_ ring of coordinates in a Polygon
            const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
            contents.push(<Polygon positions={latLngs}>{content}</Polygon>);
          }
            break;
          case "Point": {
            const latLngs = new LatLng(geojson.coordinates[0], geojson.coordinates[1]);
            contents.push(
              <Marker
                position={latLngs}
                icon={new Leaflet.Icon({
                  iconUrl: require('../../assets/images/leaflet/marker-icon.png'),
                  shadowUrl: require('../../assets/images/leaflet/marker-shadow.png'),
                  iconRetinaUrl: require('../../assets/images/leaflet/marker-icon-2x.png'),
                  iconSize: [25, 41],
                  iconAnchor: [13, 41]
                })}
              />
            );
          }
            break;
          case "LineString": {
            const latLngs = geojson.coordinates.map(([lng, lat]) => new LatLng(lat, lng));
            contents.push(<Polyline positions={latLngs}>{content}</Polyline>);
          }
            break;
          default:
            // TODO: Implement support for other geometries too (markers, square, circle)
            contents.push(<GeoJSON data={geojson} key={JSON.stringify(geojson)}>{content}</GeoJSON>);
        }
        contents.push(<GeoJSON key={id} data={geojson}>{content}</GeoJSON>);
      }
    });
    return contents;
  }

  render() {
    if (typeof window === "undefined") return null;
    const {style, hearings} = this.props;
    const {Map, TileLayer, FeatureGroup} = require('react-leaflet');  // Late import to be isomorphic compatible
    const contents = this.getHearingMapContent(hearings);
    if (!contents.length && this.props.hideIfEmpty) {
      return null;
    }
    const position = [60.192059, 24.945831];  // Default to Helsinki's center
    const crs = EPSG3067();
    return (
      <Map center={position} zoom={9} style={style} minZoom={5} scrollWheelZoom={false} crs={crs}>
        <TileLayer
          url="https://geoserver.hel.fi/mapproxy/wmts/osm-sm-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup
          ref={(input) => {
            if (!input) return;
            const bounds = input.leafletElement.getBounds();
            if (bounds.isValid()) {
              input.context.map.fitBounds(bounds);
              const viewportBounds = [
                [59.9, 24.59],  // SouthWest corner
                [60.43, 25.3]  // NorthEast corner
              ];  // Wide Bounds of City of Helsinki area
              input.context.map.setMaxBounds(viewportBounds);
            }
          }}
        >
          <div>{contents}</div>
        </FeatureGroup>
      </Map>);
  }
}

OverviewMap.propTypes = {
  hearings: PropTypes.array.isRequired,
  style: PropTypes.object,
  hideIfEmpty: PropTypes.bool,
  enablePopups: PropTypes.bool
};

OverviewMap.contextTypes = {
  language: PropTypes.string.isRequired
};

export default OverviewMap;
