import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import Leaflet from 'leaflet';

import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import isEmpty from 'lodash/isEmpty';

import {hearingShape} from '../../types';

Leaflet.Marker.prototype.options.icon = new Leaflet.Icon({
  iconUrl: require('../../../assets/images/leaflet/marker-icon.png'),
  shadowUrl: require('../../../assets/images/leaflet/marker-shadow.png'),
  iconRetinaUrl: require('../../../assets/images/leaflet/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [13, 41],
})


function getHearingArea(hearing) {
  if (typeof window === "undefined") return null;
  if (!hearing || !hearing.geojson) return null;

  const {LatLng} = require('leaflet');  // Late import to be isomorphic compatible
  const {Polygon, GeoJSON, Marker} = require('react-leaflet');  // Late import to be isomorphic compatible
  const {geojson} = hearing;
  console.log(geojson, hearing);
  switch (geojson.type) {
    case "Polygon": {
      // XXX: This only supports the _first_ ring of coordinates in a Polygon
      const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
      return <Polygon positions={latLngs}/>;
    }
    case "Point": {
      const latLngs = new LatLng(geojson.coordinates[0], geojson.coordinates[1]);
      console.log('You have a point');
      return (
        <Marker
          position={latLngs}
          icon={new Leaflet.Icon({
            iconUrl: require('../../../assets/images/leaflet/marker-icon.png'),
            shadowUrl: require('../../../assets/images/leaflet/marker-shadow.png'),
            iconRetinaUrl: require('../../../assets/images/leaflet/marker-icon-2x.png'),
            iconSize: [25, 41],
            iconAnchor: [13, 41]
          })}
        />
      );
    }
    default:
      // TODO: Implement support for other geometries too (markers, square, circle)
      return (<GeoJSON data={geojson} key={JSON.stringify(geojson)}/>);
  }
}


function getFirstGeometry(featureCollectionGeoJSON) {
  const firstFeature = featureCollectionGeoJSON.features[0];
  if (firstFeature) {
    return firstFeature.geometry;
  }
  return {};
}


class HearingFormStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.onDrawCreated = this.onDrawCreated.bind(this);
    this.onDrawDeleted = this.onDrawDeleted.bind(this);
    this.onDrawEdited = this.onDrawEdited.bind(this);
  }

  componentDidUpdate() {
    this.invalidateMap();
  }

  onDrawEdited(event) {
    // TODO: Implement proper onDrawEdited functionality
    console.log("hearing: drawEdited", event, this.props.hearing);
    console.log(getFirstGeometry(event.layers.toGeoJSON()));
    this.props.onHearingChange("geojson", getFirstGeometry(event.layers.toGeoJSON()));
  }

  onDrawCreated(event) {
    // TODO: Implement proper onDrawCreated functionality
    console.log("hearing: drawCreated", event, this.props.hearing);
    console.log('GEOMETRYYYY: ', event.layer.toGeoJSON().geometry);
    this.props.onHearingChange("geojson", event.layer.toGeoJSON().geometry);
  }

  onDrawDeleted(event) {
    // TODO: Implement proper onDrawDeleted functionality
    console.log("hearing: drawDeleted", event, this.props.hearing);
    this.props.onHearingChange("geojson", null);
  }

  invalidateMap() {
    // Map size needs to be invalidated after dynamically resizing
    // the map container.
    const map = this.refs.map;
    if (map && this.props.visible) {
      setTimeout(() => {
        map.leafletElement.invalidateSize();
      }, 200);  // Short delay to wait for the animation to end
    }
  }

  getDrawOptions() {
    const {geojson} = this.props.hearing;

    if (!geojson || isEmpty(geojson)) {
      return {
        circle: false,
        circlemarker: false,
        marker: {
          icon: new Leaflet.Icon({
            iconUrl: require('../../../assets/images/leaflet/marker-icon.png'),
            shadowUrl: require('../../../assets/images/leaflet/marker-shadow.png'),
            iconRetinaUrl: require('../../../assets/images/leaflet/marker-icon-2x.png'),
            iconSize: [25, 41],
            iconAnchor: [13, 41],
          })
        }
      }
    }
    return {
      circle: false,
      circlemarker: false,
      marker: false,
      polyline: false,
      polygon: false,
      rectangle: false,
    }
  }

  getMap() {
    if (!this.props.visible) {
      return null;
    }

    const {FeatureGroup, Map, TileLayer} = require("react-leaflet");  // Late import to be isomorphic compatible
    const {EditControl} = require("react-leaflet-draw");
    const position = [60.192059, 24.945831];  // Default to Helsinki's center
    const hearing = this.props.hearing;
    return (
      <Map
        ref="map"
        // onResize={this.invalidateMap.bind(this)}
        center={position}
        zoom={11}
        zoomControl
        className="hearing-map"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topleft"
            onEdited={this.onDrawEdited}
            onCreated={this.onDrawCreated}
            onDeleted={this.onDrawDeleted}
            draw={this.getDrawOptions()}
          />
          {getHearingArea(hearing)}
        </FeatureGroup>
      </Map>
    );
  }

  render() {
    if (typeof window === "undefined") return null;  // Skip rendering outside of browser context

    return (
      <div className="form-step">
        <FormGroup controlId="hearingArea">
          <ControlLabel><FormattedMessage id="hearingArea"/></ControlLabel>
          {this.getMap()}
        </FormGroup>
        <hr/>
        <Button bsStyle="primary" className="pull-right" onClick={this.props.onContinue}>
          <FormattedMessage id="hearingFormNext"/>
        </Button>
      </div>
    );
  }
}

HearingFormStep3.propTypes = {
  hearing: hearingShape,
  onContinue: PropTypes.func,
  onHearingChange: PropTypes.func,
  visible: PropTypes.bool,
};

const WrappedHearingFormStep3 = injectIntl(HearingFormStep3);

export default WrappedHearingFormStep3;
