/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Leaflet, { LatLng } from 'leaflet';
import { Polygon, Marker, MapContainer, Polyline, TileLayer, FeatureGroup, Popup, GeoJSON } from 'react-leaflet';
import { connect } from 'react-redux';
import localization from '@city-i18n/localization.json';
import urls from '@city-assets/urls.json';

import { getHearingURL } from '../utils/hearing';
import getAttr from '../utils/getAttr';
import leafletMarkerIconUrl from '../../assets/images/leaflet/marker-icon.png';
import leafletMarkerRetinaIconUrl from '../../assets/images/leaflet/marker-icon-2x.png';
import leafletMarkerShadowUrl from '../../assets/images/leaflet/marker-shadow.png';
import { getCorrectContrastMapTileUrl } from '../utils/map';

// eslint-disable-next-line sonarjs/cognitive-complexity
const OverviewMap = ({ mapElementLimit = 0, showOnCarousel = false, ...props }) => {
  const { hearings, language } = props;
  const [contents, setContents] = useState(null);
  const mapContainer = undefined;
  const [dimensions, setDimensions] = useState({
    height: showOnCarousel ? null : props.style.height,
    width: showOnCarousel ? null : props.style.width,
  });

  const handleUpdateMapDimensions = (container) => {
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setDimensions({ width: `${width}px`, height: `${height}px` });
      }
    }
  };

  /**
   * Return Popup with content based on hearing. If geojson.type is 'Point', apply offset to Popup
   * @param {Object} hearing
   * @param {Object} geojson
   * @returns {JSX.Element|null}
   */
  const getPopupContent = (hearing, geojson) => {
    const { enablePopups } = props;
    // offset added in order to open the popup window from the middle of the Marker instead of the default bottom.
    const options = geojson.type === 'Point' ? { offset: [0, -20] } : {};
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
  const getAdditionalParams = (hearing) => {
    const { enablePopups } = props;
    if (enablePopups) {
      return { alt: getAttr(hearing.title, language) };
    }
    return { keyboard: false };
  };

  /**
   * Return Map element based on geojson.type.
   * @param {Object} geojson
   * @param {Object} hearing
   * @returns {JSX.Element|*}
   */
  const getMapElement = (geojson, hearing) => {
    const { id } = hearing;
    if (geojson) {
      switch (geojson.type) {
        case 'Polygon': {
          // XXX: This only supports the _first_ ring of coordinates in a Polygon
          const latLngs = geojson.coordinates[0].map(([lng, lat]) => new LatLng(lat, lng));
          return (
            <Polygon key={`${id}${Math.random()}`} positions={latLngs}>
              {getPopupContent(hearing, geojson)}
            </Polygon>
          );
        }
        case 'Point': {
          const latLngs = new LatLng(geojson.coordinates[1], geojson.coordinates[0]);
          return (
            <Marker
              position={latLngs}
              key={`${id}${Math.random()}`}
              icon={
                new Leaflet.Icon({
                  iconUrl: leafletMarkerIconUrl,
                  shadowUrl: leafletMarkerShadowUrl,
                  iconRetinaUrl: leafletMarkerRetinaIconUrl,
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                })
              }
              {...getAdditionalParams(hearing)}
            >
              {getPopupContent(hearing, geojson)}
            </Marker>
          );
        }
        case 'LineString': {
          const latLngs = geojson.coordinates.map(([lng, lat]) => new LatLng(lat, lng));
          return (
            <Polyline key={`${id}${Math.random()}`} positions={latLngs}>
              {getPopupContent(hearing, geojson)}
            </Polyline>
          );
        }
        case 'FeatureCollection': {
          // if mapElementLimit is true & more than 0, display up to that amount of elements
          const mapElementArray = [];
          if (mapElementLimit && mapElementLimit > 0) {
            geojson.features.slice(0, mapElementLimit).forEach((feature) => {
              mapElementArray.push(getMapElement(feature.geometry, hearing));
            });
          } else {
            // if mapElementLimit is false -> display all elements found in FeatureCollection
            geojson.features.forEach((feature) => {
              mapElementArray.push(getMapElement(feature.geometry, hearing));
            });
          }
          return mapElementArray;
        }
        case 'Feature': {
          /**
           * Recursively get the Map element
           */
          return getMapElement(geojson.geometry, hearing);
        }
        default:
          // TODO: Implement support for other geometries too (markers, square, circle)
          return (
            <GeoJSON data={geojson} key={`${id}${Math.random()}`}>
              {getPopupContent(hearing, geojson)}
            </GeoJSON>
          );
      }
    }
    return [];
  };

  const getHearingMapContent = (tmpHearings) => {
    const mapElements = [];
    tmpHearings.forEach((hearing) => {
      const { geojson } = hearing;
      if (geojson) {
        const mapElement = getMapElement(geojson, hearing);
        if (Array.isArray(mapElement) && mapElement.length > 0) {
          mapElement.forEach((mapEl) => {
            mapElements.push(mapEl);
          });
        } else if (mapElement && !Array.isArray(mapElement)) {
          mapElements.push(mapElement);
        }
      }
    });
    setContents(mapElements);
  };

  /**
   * ensures whether it is the right time to render map.
   * In case of carousel, we require static width and height.
   * @returns {Bool}
   */
  const shouldMapRender = () => (showOnCarousel ? dimensions.height && dimensions.width : true);
  
  useEffect(() => {
    getHearingMapContent(hearings);
    handleUpdateMapDimensions(mapContainer);
    // Add any other functions that should run on component mount or hearings change here
  }, [hearings]); 

  if (typeof window === 'undefined') return null;
  if (!contents && props.hideIfEmpty) {
    return null;
  }
  
  return (
    shouldMapRender() && (
      <MapContainer
        center={localization.mapPosition}
        zoom={10}
        style={{ ...dimensions }}
        minZoom={8}
        scrollWheelZoom={false}
        {...props.mapSettings}
      >
        <TileLayer
          url={getCorrectContrastMapTileUrl(
            urls.rasterMapTiles,
            urls.highContrastRasterMapTiles,
            props.isHighContrast,
            language,
          )}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup>{contents}</FeatureGroup>
      </MapContainer>
    )
  );
};

const mapStateToProps = (state) => ({
  isHighContrast: state.accessibility.isHighContrast,
  language: state.language,
});

OverviewMap.propTypes = {
  enablePopups: PropTypes.bool,
  hearings: PropTypes.array.isRequired,
  hideIfEmpty: PropTypes.bool,
  isHighContrast: PropTypes.bool,
  language: PropTypes.string,
  mapElementLimit: PropTypes.number,
  mapSettings: PropTypes.object,
  showOnCarousel: PropTypes.bool,
  style: PropTypes.object,
};

OverviewMap.contextTypes = {
  language: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, null)(OverviewMap);
