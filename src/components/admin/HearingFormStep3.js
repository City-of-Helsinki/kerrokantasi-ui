import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import {hearingShape} from '../../types';


function getHearingArea(hearing) {
  if (typeof window === "undefined") return null;
  if (!hearing || !hearing.geojson) return null;

  const {LatLng} = require('leaflet');  // Late import to be isomorphic compatible
  const {Polygon, GeoJson} = require('react-leaflet');  // Late import to be isomorphic compatible
  const {geojson} = hearing;
  switch (geojson.type) {
    case "Polygon": {
      // XXX: This only supports the _first_ ring of coordinates in a Polygon
      const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
      return <Polygon positions={latLngs}/>;
    }
    default:
      // TODO: Implement support for other geometries too (markers, square, circle)
      return (<GeoJson data={geojson}/>);
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
        zoomControl={false}
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
  onContinue: React.PropTypes.func,
  onHearingChange: React.PropTypes.func,
  visible: React.PropTypes.bool,
};

const WrappedHearingFormStep3 = injectIntl(HearingFormStep3);

export default WrappedHearingFormStep3;
