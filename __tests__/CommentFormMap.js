import React from 'react';
import { shallow } from 'enzyme';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import Leaflet from 'leaflet';

import CommentFormMap from "../src/components/CommentFormMap/CommentFormMap";
import leafletMarkerIconUrl from "../assets/images/leaflet/marker-icon.png";
import leafletMarkerShadowUrl from "../assets/images/leaflet/marker-shadow.png";
import leafletMarkerRetinaIconUrl from "../assets/images/leaflet/marker-icon-2x.png";

const defaultProps = {
  center: { type: 'Point', coordinates: [60.451744, 22.266601] },
  mapTileUrl: 'someurl',
  onDrawCreate: () => null,
  onDrawDelete: () => null,
  contents: null,
  tools: 'all',
  language: 'fi',
  mapBounds: null,
};

function setDrawOptions(options) {
  let allTools = false;
  if (options === 'all') {
    allTools = true;
  }
  return {
    circle: false,
    circlemarker: false,
    polyline: false,
    polygon: allTools,
    rectangle: allTools,
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

const TEST_WITH_CORRECT_PROPS = 'with correct props';

describe('src/components/CommentFormMap/CommentFormMap.js', () => {
  function getWrapper(props) {
    return shallow(<CommentFormMap {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    describe('Map', () => {
      function getMap(props) {
        return getWrapper(props).find(Map);
      }
      test(TEST_WITH_CORRECT_PROPS, () => {
        const element = getMap();
        expect(element).toHaveLength(1);
        expect(element.prop('center')).toEqual(defaultProps.center);
        expect(element.prop('scrollWheelZoom')).toBe(false);
        expect(element.prop('zoom')).toBe(15);
        expect(element.prop('maxZoom')).toBe(18);
        expect(element.prop('minZoom')).toBe(11);
        expect(element.prop('style')).toBeDefined();
        expect(element.prop('maxBounds')).toBeDefined();
      });
    });
    describe('TileLayer', () => {
      test(TEST_WITH_CORRECT_PROPS, () => {
        const element = getWrapper().find(TileLayer);
        expect(element).toHaveLength(1);
        expect(element.prop('url')).toEqual(defaultProps.mapTileUrl);
        expect(element.prop('attribution')).toBeDefined();
      });
    });
    describe('FeatureGroup', () => {
      test(TEST_WITH_CORRECT_PROPS, () => {
        const element = getWrapper().find(FeatureGroup);
        expect(element).toHaveLength(1);
      });
    });
    describe('EditControl', () => {
      test(TEST_WITH_CORRECT_PROPS, () => {
        const element = getWrapper().find(EditControl);
        expect(element).toHaveLength(1);
        expect(element.prop('position')).toBe('topleft');
        expect(element.prop('onCreated')).toBe(defaultProps.onDrawCreate);
        expect(element.prop('onDeleted')).toBe(defaultProps.onDrawDelete);
        expect(element.prop('draw')).toBeDefined();
        expect(element.prop('edit')).toEqual({ edit: false });
      });
      test('draw prop is correct when tools !== all', () => {
        const element = getWrapper({ tools: 'marker' }).find(EditControl);
        expect(element).toHaveLength(1);
        expect(element.prop('draw')).toMatchObject(setDrawOptions('marker'));
      });
      test('draw prop is correct when tools === all', () => {
        const element = getWrapper({ tools: 'all' }).find(EditControl);
        expect(element).toHaveLength(1);
        expect(element.prop('draw')).toMatchObject(setDrawOptions('all'));
      });
    });
  });
});
