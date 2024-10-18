/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Leaflet from 'leaflet';
import { Button } from 'hds-react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import { isEmpty, includes, keys, isMatch } from 'lodash';
import { connect, useDispatch } from 'react-redux';
import localization from '@city-i18n/localization.json';
import urls from '@city-assets/urls.json';
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import { createLocalizedNotificationPayload, createNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import Icon from '../../utils/Icon';
import leafletMarkerIconUrl from '../../../assets/images/leaflet/marker-icon.png';
import leafletMarkerRetinaIconUrl from '../../../assets/images/leaflet/marker-icon-2x.png';
import leafletMarkerShadowUrl from '../../../assets/images/leaflet/marker-shadow.png';
import getTranslatedTooltips from '../../utils/getTranslatedTooltips';
import { hearingShape } from '../../types';
import { getCorrectContrastMapTileUrl, getMapElement } from '../../utils/map';
import { parseCollection } from '../../utils/hearingEditor';
import { addToast } from '../../actions/toast';

Leaflet.Marker.prototype.options.icon = new Leaflet.Icon({
  iconUrl: leafletMarkerIconUrl,
  shadowUrl: leafletMarkerShadowUrl,
  iconRetinaUrl: leafletMarkerRetinaIconUrl,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
});

function getFirstGeometry(featureCollectionGeoJSON) {
  const firstFeature = featureCollectionGeoJSON.features[0];
  if (firstFeature) {
    return firstFeature.geometry;
  }
  return {};
}

/**
 * Returns an array of the remaining features
 * @param {Object[]} currentFeatures
 * @param {Object[]} removedFeatures
 * @returns {Object[] | []} currentFeatures - removedFeatures
 */
function featureReducer(currentFeatures, removedFeatures) {
  return currentFeatures.reduce((features, feature) => {
    if (feature.geometry) {
      if (!removedFeatures.some((mapElement) => isMatch(mapElement, feature.geometry))) {
        features.push(feature);
      }
    } else if (!removedFeatures.some((mapElement) => isMatch(mapElement, feature))) {
      features.push(feature);
    }
    return features;
  }, []);
}

const MESSAGE_INCORRECT_FILE = 'Virheellinen tiedosto.';

const HearingFormStep3 = (props) => {
  let map;
  let featureGroup;
  const { hearing, language, isHighContrast, visible } = props; // const props
  const {
    onHearingChange,
    onCreateMapMarker,
    onAddMapMarker,
    onAddMapMarkersToCollection,
    onContinue,
  } = props; // function props
  const [isEdited, setIsEdited] = useState(false);
  const [initialGeoJSON, setInitialGeoJSON] = useState(props.hearing.geojson);

  const dispatch = useDispatch();

  useEffect(() => {
    Leaflet.drawLocal = getTranslatedTooltips(language);
  }, [language]);

  const onDrawEdited = (event) => {
    // TODO: Implement proper onDrawEdited functionality
    setIsEdited(true);
    onHearingChange('geojson', getFirstGeometry(event.layers.toGeoJSON()));
  }

  const onDrawCreated = (event) => {
    // TODO: Implement proper onDrawCreated functionality
    if (isEdited) {
      /**
       * first time an element is created and the map hasn't been edited/elements removed
       */
      setIsEdited(true);
      if (!hearing.geojson || !hearing.geojson.type) {
        /**
         * if hearing.geojson is null or doesnt have type -> add a single element
         */
        onCreateMapMarker(event.layer.toGeoJSON().geometry);
      } else if (hearing.geojson.type !== 'FeatureCollection') {
        /**
         * if hearing.geojson has a type that isn't FeatureCollection
         * -> add element and transform hearing.geojson to FeatureCollection
         */
        onAddMapMarker(event.layer.toGeoJSON());
      } else if (hearing.geojson.type === 'FeatureCollection') {
        /**
         * if hearing.geojson type is FeatureCollection - add element to geojson.features
         */
        onAddMapMarkersToCollection(event.layer.toGeoJSON());
      }
    } else if (hearing.geojson.coordinates) {
      /**
       * if geojson has coordinates -> transform hearing.geojson to FeatureCollection and add element
       */
      onAddMapMarker(event.layer.toGeoJSON());
    } else {
      /**
       * hearing.geojson is a FeatureCollection -> add element to geojson.features
       */
      onAddMapMarkersToCollection(event.layer.toGeoJSON());
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onDrawDeleted = (event) => {
    // TODO: Implement proper onDrawDeleted functionality
    if (event.layers && !isEmpty(event.layers._layers) && hearing.geojson.features) {
      /**
       * state.initialGeoJSON contains data when editing an existing hearing or when a geojson file has been uploaded.
       * initialGeoJSON contains the hearings original map data and it is ONLY modified
       * when one or more of the original map elements are removed.
       * initialGeoJSON does NOT update when props.hearing.geojson changes when adding new elements.
       *
       * props.hearing.geojson contains the original map data + any elements added to the map.
       *
       * The elements in initialGeoJSON are displayed as static elements on the map and any new added elements exist
       * as separate variables inside Leaflet. So if the removed element was one of the original(static) elements then
       * it is removed from props.hearing.geojson AND initialGeoJSON,
       * if it was one of the newly added(not saved) elements then it is removed from props.hearing.geojson.
       */
      // if the hearing.geojson is a FeatureCollection that has features
      const currentFeatures = hearing.geojson.features;
      let currentStateFeatures;
      if (initialGeoJSON) {
        // initialGeoJSON is truthy if editing existing hearing or a geojson file has been uploaded
        currentStateFeatures = initialGeoJSON.type === 'FeatureCollection' ? initialGeoJSON.features : null;
      }
      // event.layers._layers object has unique keys for each deleted map element
      const layerKeys = Object.keys(event.layers._layers);

      // Loop through event.layers._layers -> transform each to geojson and push geometry value to array
      const removedMapElements = layerKeys.reduce((accumulator, currentValue) => {
        if (event.layers._layers[currentValue]) {
          accumulator.push(event.layers._layers[currentValue].toGeoJSON().geometry);
        }
        return accumulator;
      }, []);

      // Remaining map features(props) after removing the deleted features.
      const remainingFeatures = featureReducer(currentFeatures, removedMapElements);

      let remainingStateFeatures;
      if (currentStateFeatures) {
        // Remaining map features(state) after removing the deleted feature
        remainingStateFeatures = featureReducer(currentStateFeatures, removedMapElements);
      }

      if (remainingFeatures.length === 0) {
        // hearing is a FeatureCollection and all elements have been removed
        onHearingChange('geojson', {});
        setIsEdited(false);
        setInitialGeoJSON({});
      } else {
        // hearing is a FeatureCollection that still has elements after removal
        onHearingChange('geojson', { type: hearing.geojson.type, features: remainingFeatures });
        if (currentStateFeatures) {
          setIsEdited(true);
          setInitialGeoJSON({ type: hearing.geojson.type, features: remainingStateFeatures });
        } else {
          setIsEdited(true);
        }
      }
    } else {
      // hearing.geojson is a single element that has been removed
      onHearingChange('geojson', {});
      setIsEdited(false);
      setInitialGeoJSON({});
    }
  }

  const readTextFile = (file, callback) => {
    try {
      const reader = new FileReader();

      reader.onload = () => callback(reader.result);

      reader.readAsText(file);
    } catch (err) {
      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, MESSAGE_INCORRECT_FILE)));
    }
  };

  const onUploadGeoJSON = (event) => {
    readTextFile(event.target.files[0], (json) => {
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
          if (featureCollection.features[0].geometry.coordinates.length === 0) {
            dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.error, 'Tiedostosta ei löytynyt koordinaatteja.')));
            return;
          }
          onHearingChange('geojson', featureCollection.features[0].geometry);
          const parsedFile = parseCollection(featureCollection);
          onCreateMapMarker(parsedFile);
          setInitialGeoJSON(parsedFile);
        } else {
          dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, MESSAGE_INCORRECT_FILE)));
        }
      } catch (err) {
        dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, MESSAGE_INCORRECT_FILE)));
      }
    });
  };

  // eslint-disable-next-line class-methods-use-this
  const getDrawOptions  = () => ({
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
        }),
      },
    })



  useEffect(() => {
    if (map && visible) {
      setTimeout(() => {
        map.invalidateSize();
      }, 200); // Short delay to wait for the animation to end
    }
  }, [visible, map])

  const refCallBack = (el) => {
    map = el;
  };
  
  if (typeof window === "undefined") return null;

  return (
    <div className='form-step'>
      <FormGroup controlId='hearingArea'>
        <ControlLabel>
          <FormattedMessage id='hearingArea' />
        </ControlLabel>
        <MapContainer
          ref={refCallBack}
          center={localization.mapPosition}
          style={{ width: '100%', height: 600 }}
          zoom={10}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={getCorrectContrastMapTileUrl(
              urls.rasterMapTiles,
              urls.highContrastRasterMapTiles,
              isHighContrast,
              language,
            )}
          />
          <FeatureGroup
            ref={(group) => {
              featureGroup = group;
            }}
          >
            <EditControl
              position='topleft'
              onEdited={onDrawEdited}
              onCreated={onDrawCreated}
              onDeleted={onDrawDeleted}
              draw={getDrawOptions()}
              edit={{
                featureGroup,
                edit: false,
              }}
            />
            { getMapElement(initialGeoJSON) }
          </FeatureGroup>
        </MapContainer>
      </FormGroup>

      <div className='step-control'>
        <label className='geojson_button' htmlFor='geojsonUploader'>
          <input id='geojsonUploader' type='file' onChange={onUploadGeoJSON} style={{ display: 'none' }} />
          <Icon className='icon' name='upload' style={{ marginRight: '5px' }} />
          <FormattedMessage id='addGeojson' />
        </label>
        <HelpBlock>
          <FormattedMessage id='addGeojsonInfo' />
        </HelpBlock>
      </div>
      <div className='step-footer'>
        <Button className='kerrokantasi-btn' onClick={onContinue}>
          <FormattedMessage id='hearingFormNext' />
        </Button>
      </div>
    </div>
  );
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

const WrappedHearingFormStep3 = injectIntl(HearingFormStep3);
export { WrappedHearingFormStep3 as UnconnectedHearingFormStep3 };
export default connect(mapStateToProps, null)(WrappedHearingFormStep3);
