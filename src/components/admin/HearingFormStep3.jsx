/* eslint-disable sonarjs/todo-tag */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Leaflet from 'leaflet';
import { Button, Fieldset, FileInput } from 'hds-react';
import { isEmpty, includes, keys, isMatch } from 'lodash';
import { connect, useDispatch } from 'react-redux';
import localization from '@city-i18n/localization.json';
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import config from '../../config';
import { createLocalizedNotificationPayload, createNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import leafletMarkerIconUrl from '../../../assets/images/leaflet/marker-icon.png';
import leafletMarkerRetinaIconUrl from '../../../assets/images/leaflet/marker-icon-2x.png';
import leafletMarkerShadowUrl from '../../../assets/images/leaflet/marker-shadow.png';
import getTranslatedTooltips from '../../utils/getTranslatedTooltips';
import { hearingShape } from '../../types';
import { getCorrectContrastMapTileUrl, getMapElement } from '../../utils/map';
import { parseCollection } from '../../utils/hearingEditor';
import { addToast } from '../../actions/toast';
import { ACCEPTED_GEOJSON_TYPES } from '../../utils/constants';

Leaflet.Marker.prototype.options.icon = new Leaflet.Icon({
  iconUrl: leafletMarkerIconUrl,
  shadowUrl: leafletMarkerShadowUrl,
  iconRetinaUrl: leafletMarkerRetinaIconUrl,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
});

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
  const { onHearingChange, onAddMapMarker, onContinue } = props; // function props
  const [geoJSON, setGeoJSON] = useState(props.hearing.geojson);

  const dispatch = useDispatch();

  useEffect(() => {
    Leaflet.drawLocal = getTranslatedTooltips(language);
  }, [language]);

  const onDrawCreated = useCallback(
    (event) => {
      onAddMapMarker(event.layer.toGeoJSON());
    },
    [onAddMapMarker],
  );

  const onDrawDeleted = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (event) => {
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
        if (geoJSON) {
          // initialGeoJSON is truthy if editing existing hearing or a geojson file has been uploaded
          currentStateFeatures = geoJSON.type === 'FeatureCollection' ? geoJSON.features : null;
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
          setGeoJSON({});
        } else {
          // hearing is a FeatureCollection that still has elements after removal
          onHearingChange('geojson', { type: hearing.geojson.type, features: remainingFeatures });
          if (currentStateFeatures) {
            setGeoJSON({ type: hearing.geojson.type, features: remainingStateFeatures });
          }
        }
      } else {
        // hearing.geojson is a single element that has been removed
        onHearingChange('geojson', {});
        setGeoJSON({});
      }
    },
    [hearing.geojson, geoJSON, onHearingChange],
  );

  const readTextFile = (file, callback) => {
    try {
      const reader = new FileReader();

      reader.onload = () => callback(reader.result);

      reader.readAsText(file);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, MESSAGE_INCORRECT_FILE)));
    }
  };

  const validateCollection = (collection) => {
    if (collection.type === 'FeatureCollection') {
      const { features: collectionFeatures } = collection;

      if (!isEmpty(collectionFeatures) && Array.isArray(collectionFeatures)) {
        const filteredFeatured = collectionFeatures
          .filter((feature) => {
            const hasRequiredProperties =
              includes(keys(feature), 'geometry') &&
              includes(keys(feature.geometry), 'type') &&
              includes(keys(feature.geometry), 'coordinates');

            if (hasRequiredProperties) {
              if (!feature.geometry.coordinates.length) {
                dispatch(
                  addToast(
                    createNotificationPayload(NOTIFICATION_TYPES.error, 'Tiedostosta ei löytynyt koordinaatteja.'),
                  ),
                );

                return false;
              }

              return feature;
            }

            return false;
          })
          .filter(Boolean);

        return { ...collection, features: filteredFeatured };
      }

      throw new Error('No features found');
    } else {
      throw new Error('Invalid geojson');
    }
  };

  const onUploadGeoJSON = (files) => {
    if (!files.length) {
      onHearingChange('geojson', {});
      setGeoJSON({});

      return;
    }

    readTextFile(files[0], (json) => {
      try {
        const featureCollection = JSON.parse(json);
        const validCollection = validateCollection(featureCollection);

        const parsedFile = parseCollection(validCollection);

        onHearingChange('geojson', parsedFile);
        setGeoJSON(parsedFile);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, MESSAGE_INCORRECT_FILE)));
      }
    });
  };

  const getDrawOptions = () => ({
    circle: false,
    circlemarker: false,
    polyline: false,
    rectangle: { showArea: false },
    marker: {
      icon: new Leaflet.Icon({
        iconUrl: leafletMarkerIconUrl,
        shadowUrl: leafletMarkerShadowUrl,
        iconRetinaUrl: leafletMarkerRetinaIconUrl,
        iconSize: [25, 41],
        iconAnchor: [13, 41],
      }),
    },
  });

  useEffect(() => {
    if (map && visible) {
      setTimeout(() => {
        map.invalidateSize();
      }, 200); // Short delay to wait for the animation to end
    }
  }, [visible, map]);

  function refCallback(instance) {
    if (instance) {
      map = instance;
    }
  }

  if (typeof window === 'undefined') return null;

  return (
    <div className='form-step'>
      <Fieldset id='hearingArea' heading={<FormattedMessage id='hearingArea' />}>
        <MapContainer
          ref={refCallback}
          center={localization.mapPosition}
          style={{ width: '100%', height: 600 }}
          zoom={10}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={getCorrectContrastMapTileUrl(
              config.rasterMapTiles,
              config.highContrastRasterMapTiles,
              isHighContrast,
              language,
            )}
          />
          <FeatureGroup ref={featureGroup}>
            <EditControl
              position='topleft'
              onCreated={onDrawCreated}
              onDeleted={onDrawDeleted}
              draw={getDrawOptions()}
              edit={{
                featureGroup,
                edit: false,
              }}
            />
            {getMapElement(geoJSON)}
          </FeatureGroup>
        </MapContainer>
      </Fieldset>

      <div className='step-control'>
        <FileInput
          id='geojsonUploader'
          label={<FormattedMessage id='addGeojson' />}
          onChange={onUploadGeoJSON}
          helperText={<FormattedMessage id='addGeojsonInfo' />}
          accept={ACCEPTED_GEOJSON_TYPES}
        />
      </div>
      <div className='step-footer'>
        <Button className='kerrokantasi-btn' onClick={onContinue}>
          <FormattedMessage id='hearingFormNext' />
        </Button>
      </div>
    </div>
  );
};

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
};

export default connect(mapStateToProps, null)(injectIntl(HearingFormStep3));
