import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import Leaflet from 'leaflet';
import getTranslatedTooltips from '../../utils/getTranslatedTooltips';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import {isEmpty, includes, keys, isMatch} from 'lodash';
import {ZoomControl} from 'react-leaflet';
import {localizedNotifyError} from '../../utils/notify';
import Icon from '../../utils/Icon';
import { connect } from 'react-redux';

import leafletMarkerIconUrl from '../../../assets/images/leaflet/marker-icon.png';
import leafletMarkerRetinaIconUrl from '../../../assets/images/leaflet/marker-icon-2x.png';
import leafletMarkerShadowUrl from '../../../assets/images/leaflet/marker-shadow.png';
/* eslint-disable import/no-unresolved */
import localization from '@city-i18n/localization.json';
import urls from '@city-assets/urls.json';
/* eslint-enable import/no-unresolved */

import {hearingShape} from '../../types';
import { getCorrectContrastMapTileUrl } from '../../utils/map';
import {parseCollection} from "../../utils/hearingEditor";

// This is needed for the invalidateMap not to fire after the component has dismounted and causing error.
let mapInvalidator;

Leaflet.Marker.prototype.options.icon = new Leaflet.Icon({
  iconUrl: leafletMarkerIconUrl,
  shadowUrl: leafletMarkerShadowUrl,
  iconRetinaUrl: leafletMarkerRetinaIconUrl,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
});

/**
 * Returns map elements according to hearing.geojson.
 *
 * If geojson.type is Polygon/Point/LineString -> return that map element.
 *
 * If geojson.type is FeatureCollection -> return map elements[] for each value in geojson.features.
 * @param {object} hearing
 * @returns {JSX.Element|null|*[]}
 */
function getHearingArea(hearing) {
  if (typeof window === "undefined") return null;
  if (!hearing || !hearing.geojson) return null;
  if (!hearing.geojson.type) return null;


  const {LatLng} = require('leaflet');  // Late import to be isomorphic compatible
  const {Polygon, GeoJSON, Marker, Polyline} = require('react-leaflet');  // Late import to be isomorphic compatible
  const {geojson} = hearing;
  switch (geojson.type) {
    case "Polygon": {
      // XXX: This only supports the _first_ ring of coordinates in a Polygon
      const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
      return <Polygon key={Math.random()} positions={latLngs}/>;
    }
    case "Point": {
      const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
      return (
        <Marker
          key={Math.random()}
          position={latLngs}
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
      return (<Polyline positions={latLngs}/>);
    }
    case "FeatureCollection": {
      const features = geojson.features;
      const elementCollection = features.reduce((accumulator, currentValue) => {
        accumulator.push(getMapElement(currentValue));
        return accumulator;
      }, []);
      return [...elementCollection];
    }
    default:
      // TODO: Implement support for other geometries too (markers, square, circle)
      return (<GeoJSON data={geojson} key={JSON.stringify(geojson)}/>);
  }
}

/**
 * Returns map elements according to geojson.type
 * @param {object} geojson
 * @returns {JSX.Element|*}
 */
function getMapElement(geojson) {
  const {LatLng} = require('leaflet');  // Late import to be isomorphic compatible
  const {Polygon, GeoJSON, Marker, Polyline} = require('react-leaflet');  // Late import to be isomorphic compatible
  switch (geojson.type) {
    case "Polygon": {
      // XXX: This only supports the _first_ ring of coordinates in a Polygon
      const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
      return <Polygon key={Math.random()} positions={latLngs}/>;
    }
    case "Point": {
      const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
      return (
        <Marker
          key={Math.random()}
          position={latLngs}
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
      return (<Polyline positions={latLngs}/>);
    }
    case "Feature": {
      /**
       * Recursively get the map element
       * @example
       * geojson = {type: 'Feature', geometry:{type: 'Point', coordinates: [...]}}
       */
      return getMapElement(geojson.geometry);
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
    // This is necessary to prevent getHearingArea() from rendering drawings twice after editing
    this.state = {isEdited: false, initialGeoJSON: {geojson: this.props.hearing.geojson}};
  }

  componentDidMount() {
    Leaflet.drawLocal = getTranslatedTooltips(this.props.language);
  }

  componentWillReceiveProps(nextProps) {
    const {language} = this.props;

    if (nextProps.language !== language) {
      Leaflet.drawLocal = getTranslatedTooltips(nextProps.language);
    }
  }

  componentDidUpdate() {
    this.invalidateMap();
  }

  componentWillUnmount() {
    clearTimeout(mapInvalidator);
  }

  onDrawEdited(event) {
    // TODO: Implement proper onDrawEdited functionality
    this.setState({isEdited: true});
    this.props.onHearingChange("geojson", getFirstGeometry(event.layers.toGeoJSON()));
  }

  onDrawCreated(event) {
    // TODO: Implement proper onDrawCreated functionality
    if (!this.state.isEdited) {
      /**
       * first time an element is created and the map hasn't been edited/elements removed
       */
      this.setState({isEdited: true});
      if (!this.props.hearing.geojson || !this.props.hearing.geojson.type) {
        /**
         * if hearing.geojson is null or doesnt have type -> add a single element
         */
        this.props.onCreateMapMarker(event.layer.toGeoJSON().geometry);
      } else if (this.props.hearing.geojson.type !== 'FeatureCollection') {
        /**
         * if hearing.geojson has a type that isn't FeatureCollection
         * -> add element and transform hearing.geojson to FeatureCollection
         */
        this.props.onAddMapMarker(event.layer.toGeoJSON());
      } else if (this.props.hearing.geojson.type === 'FeatureCollection') {
        /**
         * if hearing.geojson type is FeatureCollection - add element to geojson.features
         */
        this.props.onAddMapMarkersToCollection(event.layer.toGeoJSON());
      }
    } else if (this.props.hearing.geojson.coordinates) {
      /**
       * if geojson has coordinates -> transform hearing.geojson to FeatureCollection and add element
       */
      this.props.onAddMapMarker(event.layer.toGeoJSON());
    } else {
      /**
       * hearing.geojson is a FeatureCollection -> add element to geojson.features
       */
      this.props.onAddMapMarkersToCollection(event.layer.toGeoJSON());
    }
  }

  onDrawDeleted(event) {
    // TODO: Implement proper onDrawDeleted functionality
    if (event.layers && !isEmpty(event.layers._layers) && this.props.hearing.geojson.features) {
      // if the hearing.geojson is a FeatureCollection that has features

      const currentFeatures = this.props.hearing.geojson.features;

      // event.layers._layers object has unique keys for each deleted map element
      const layerKeys = Object.keys(event.layers._layers);

      /**
       * Loop through event.layers._layers -> transform each to geojson and push geometry value to array
       * @type {Object[]}
       */
      const removedMapElements = layerKeys.reduce((accumulator, currentValue) => {
        if (event.layers._layers[currentValue]) {
          accumulator.push(event.layers._layers[currentValue].toGeoJSON().geometry);
        }
        return accumulator;
      }, []);

      /**
       * Remaining map features after removing the deleted features.
       */
      const remainingFeatures = currentFeatures.reduce((features, feature) => {
        if (feature.geometry) {
          if (!removedMapElements.some(mapElement => isMatch(mapElement, feature.geometry))) {
            features.push(feature);
          }
        } else if (!removedMapElements.some(mapElement => isMatch(mapElement, feature))) {
          features.push(feature);
        }

        return features;
      }, []);

      if (remainingFeatures.length === 0) {
        // hearing is a FeatureCollection and all elements have been removed
        this.props.onHearingChange("geojson", {});
        this.setState({isEdited: false});
      } else {
        // hearing is a FeatureCollection that still has elements after removal
        this.props.onHearingChange("geojson", {type: this.props.hearing.geojson.type, features: remainingFeatures});
        this.setState({isEdited: true});
      }
    } else {
      // hearing.geojson is a single element that has been removed
      this.props.onHearingChange("geojson", {});
      this.setState({isEdited: false});
    }
  }

  onUploadGeoJSON = (event) => {
    this.readTextFile(event.target.files[0], (json) => {
      try {
        const featureCollection = JSON.parse(json);
        if (
          featureCollection.type === 'FeatureCollection' &&
          !isEmpty(featureCollection.features) &&
          Array.isArray(featureCollection.features) &&
          includes(keys(featureCollection.features[0]), 'geometry') &&
          includes(keys(featureCollection.features[0].geometry), 'type') &&
          includes(keys(featureCollection.features[0].geometry), 'coordinates')
        ) {
          const parsedFile = parseCollection(featureCollection);
          this.props.onCreateMapMarker(parsedFile);
          this.setState({initialGeoJSON: {geojson: parsedFile}});
        } else {
          localizedNotifyError('Virheellinen tiedosto.');
        }
      } catch (err) {
        localizedNotifyError('Virheellinen tiedosto.');
      }
    });
  }

  readTextFile = (file, callback) => {
    try {
      const reader = new FileReader();

      reader.onload = () => callback(reader.result);

      reader.readAsText(file);
    } catch (err) {
      localizedNotifyError('Virheellinen tiedosto.');
    }
  }

  invalidateMap() {
    // Map size needs to be invalidated after dynamically resizing
    // the map container.
    const map = this.map;
    if (map && this.props.visible) {
      mapInvalidator = setTimeout(() => {
        map.leafletElement.invalidateSize();
      }, 200);  // Short delay to wait for the animation to end
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getDrawOptions() {
    return {
      circle: false,
      circlemarker: false,
      polyline: false,
      marker: {
        icon: new Leaflet.Icon({
          iconUrl: leafletMarkerIconUrl,
          shadowUrl: leafletMarkerShadowUrl,
          iconRetinaUrl: leafletMarkerRetinaIconUrl,
          iconSize: [25, 41],
          iconAnchor: [13, 41],
        })
      },
    };
  }

  refCallBack = (el) => {
    this.map = el;
  }
  render() {
    if (typeof window === "undefined") return null;  // Skip rendering outside of browser context
    const {FeatureGroup, Map, TileLayer} = require("react-leaflet");  // Late import to be isomorphic compatible
    const {EditControl} = require("react-leaflet-draw");
    const {initialGeoJSON} = this.state;

    return (
      <div className="form-step">
        <FormGroup controlId="hearingArea">
          <ControlLabel><FormattedMessage id="hearingArea"/></ControlLabel>
          <Map
            ref={this.refCallBack}
            // onResize={this.invalidateMap.bind(this)}
            zoomControl={false}
            center={localization.mapPosition}
            zoom={11}
            className="hearing-map"
          >
            <ZoomControl zoomInTitle="Lähennä" zoomOutTitle="Loitonna"/>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url={getCorrectContrastMapTileUrl(urls.rasterMapTiles,
                  urls.highContrastRasterMapTiles, this.props.isHighContrast)}
            />
            <FeatureGroup ref={(group) => { this.featureGroup = group; }}>
              <EditControl
                  position="topleft"
                  onEdited={this.onDrawEdited}
                  onCreated={this.onDrawCreated}
                  onDeleted={this.onDrawDeleted}
                  draw={this.getDrawOptions()}
                  edit={
                    {
                      featureGroup: this.featureGroup,
                      edit: false
                    }
                  }
              />
              {getHearingArea(initialGeoJSON)}
            </FeatureGroup>
          </Map>
        </FormGroup>
        <div className="step-control">
          <label className="geojson_button" htmlFor="geojsonUploader">
            <input id="geojsonUploader" type="file" onChange={this.onUploadGeoJSON} style={{display: 'none'}} />
            <Icon className="icon" name="upload" style={{marginRight: '5px'}}/>
            <FormattedMessage id="addGeojson"/>
          </label>
        </div>
        <div className="step-footer">
          <Button
            bsStyle="default"
            onClick={this.props.onContinue}
          >
            <FormattedMessage id="hearingFormNext"/>
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isHighContrast: state.accessibility.isHighContrast,
});

HearingFormStep3.propTypes = {
  hearing: hearingShape,
  onContinue: PropTypes.func,
  onHearingChange: PropTypes.func,
  visible: PropTypes.bool,
  language: PropTypes.string,
  isHighContrast: PropTypes.bool,
  onAddMapMarker: PropTypes.func,
  onAddMapMarkersToCollection: PropTypes.func,
  onCreateMapMarker: PropTypes.func,
};

export {HearingFormStep3 as UnconnectedHearingFormStep3};
const WrappedHearingFormStep3 = connect(mapStateToProps, null)(injectIntl(HearingFormStep3));

export default WrappedHearingFormStep3;
