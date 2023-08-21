import React from 'react';
import { shallow } from 'enzyme';

import { UnconnectedHearingFormStep3 } from '../../src/components/admin/HearingFormStep3';

const generateCoordinates = () => [Math.random() * (21 - 20) + 20, Math.random() * (62 - 60) + 60];
const mockPoint = () => ({ type: 'Point', coordinates: generateCoordinates() });

const mockFeatureCollection = () => ({
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: mockPoint() },
    { type: 'Feature', geometry: mockPoint() },
    { type: 'Feature', geometry: mockPoint() },
    { type: 'Feature', geometry: mockPoint() },
  ],
});
const defaultProps = {
  hearing: {},
  onHearingChange: () => {},
  onAddMapMarker: () => {},
  onAddMapMarkersToCollection: () => {},
  onCreateMapMarker: () => {},
};
describe('HearingFormStep3', () => {
  function getWrapper(props) {
    return shallow(<UnconnectedHearingFormStep3 {...defaultProps} {...props} />);
  }
  describe('methods', () => {
    describe('onDrawCreated', () => {
      let mockAddedPoint;
      function getEvent(props) {
        return {
          layer: {
            toGeoJSON: () => props,
          },
        };
      }

      beforeEach(() => {
        mockAddedPoint = mockPoint();
      });

      test('calls onCreateMapMarker with correct params when adding element to a new hearing', () => {
        const mockOnCreateMapMarker = jest.fn();
        const mockPointGeometry = mockPoint();
        const mockEvent = getEvent({ geometry: mockPointGeometry });
        const wrapper = getWrapper({ onCreateMapMarker: mockOnCreateMapMarker });

        expect(wrapper.state('isEdited')).toBe(false);
        wrapper.instance().onDrawCreated(mockEvent);
        expect(mockOnCreateMapMarker).toHaveBeenCalledWith(mockPointGeometry);
        expect(wrapper.state('isEdited')).toBe(true);
      });

      test('calls onAddMapMarker when adding an element to a hearing with a single geojson value(not collection)', () => {
        const mockOnAddMapMarker = jest.fn();
        const mockEvent = getEvent(mockAddedPoint);
        const wrapper = getWrapper({ onAddMapMarker: mockOnAddMapMarker, hearing: { geojson: mockPoint() } });

        expect(wrapper.state('isEdited')).toBe(false);
        wrapper.instance().onDrawCreated(mockEvent);
        expect(mockOnAddMapMarker).toHaveBeenCalledWith(mockAddedPoint);
        expect(wrapper.state('isEdited')).toBe(true);
      });

      test('calls onAddMapMarkersToCollection when adding an element to a hearing that has a featurecollection', () => {
        const mockOnAddMapMarkersToCollection = jest.fn();
        const mockEvent = getEvent(mockAddedPoint);
        const wrapper = getWrapper({
          onAddMapMarkersToCollection: mockOnAddMapMarkersToCollection,
          hearing: { geojson: mockFeatureCollection() },
        });

        expect(wrapper.state('isEdited')).toBe(false);
        wrapper.instance().onDrawCreated(mockEvent);
        expect(mockOnAddMapMarkersToCollection).toHaveBeenCalledWith(mockAddedPoint);
        expect(wrapper.state('isEdited')).toBe(true);
      });

      test('calls onAddMapMarker when adding an element to a hearing with a single geojson that has already been edited', () => {
        // ie isEdited is true
        const mockOnAddMapMarker = jest.fn();
        const mockEvent = getEvent(mockAddedPoint);
        const wrapper = getWrapper({ onAddMapMarker: mockOnAddMapMarker, hearing: { geojson: mockPoint() } });
        wrapper.setState({ isEdited: true });

        expect(wrapper.state('isEdited')).toBe(true);
        wrapper.instance().onDrawCreated(mockEvent);
        expect(mockOnAddMapMarker).toHaveBeenCalledWith(mockAddedPoint);
        expect(wrapper.state('isEdited')).toBe(true);
      });

      // eslint-disable-next-line max-len
      test('calls onAddMapMarkersToCollection when adding an element to a hearing with a featurecollection that has been edited', () => {
        // ie isEdited is true
        const mockOnAddMapMarkersToCollection = jest.fn();
        const mockEvent = getEvent(mockAddedPoint);
        const wrapper = getWrapper({
          onAddMapMarkersToCollection: mockOnAddMapMarkersToCollection,
          hearing: { geojson: mockFeatureCollection() },
        });

        wrapper.setState({ isEdited: true });
        wrapper.instance().onDrawCreated(mockEvent);
        expect(mockOnAddMapMarkersToCollection).toHaveBeenCalledWith(mockAddedPoint);
        expect(wrapper.state('isEdited')).toBe(true);
      });
    });

    describe('onDrawDeleted', () => {
      function getEvent(props) {
        return { layers: { _layers: props } };
      }
      let mockOnHearingChange;

      beforeEach(() => {
        mockOnHearingChange = jest.fn();
      });

      test('call onHearingChange with correct params when removing the last/only element(not collection) of a hearing', () => {
        // correct params are "geojson" and {}
        const wrapper = getWrapper({ onHearingChange: mockOnHearingChange, hearing: { geojson: mockPoint() } });
        wrapper.instance().onDrawDeleted(getEvent('foo'));
        expect(mockOnHearingChange).toHaveBeenCalledWith('geojson', {});
      });

      test('call onHearingChange with correct params when removing element from collection', () => {
        // expected call params are mockCollection object with 1 less element in features.
        const mockCollection = mockFeatureCollection();
        const removedElement = mockCollection.features[0];
        const expectedObject = { type: mockCollection.type, features: mockCollection.features.slice(1) };
        const wrapper = getWrapper({ onHearingChange: mockOnHearingChange, hearing: { geojson: mockCollection } });

        expect(wrapper.state('isEdited')).toBe(false);
        wrapper.instance().onDrawDeleted(getEvent({ foo: { toGeoJSON: () => removedElement } }));
        expect(wrapper.state('isEdited')).toBe(true);
        expect(mockOnHearingChange).toHaveBeenCalledWith('geojson', expectedObject);
      });

      test('call onHearingChange with correct params when removing multiple elements from collection', () => {
        // expected call params are mockCollection object with 2 less elements in features
        const mockCollection = mockFeatureCollection();
        const firstRemovedElement = mockCollection.features[0];
        const secondRemovedElement = mockCollection.features[1];
        const expectedObject = { type: mockCollection.type, features: mockCollection.features.slice(2) };
        const eventObject = {
          first: { toGeoJSON: () => firstRemovedElement },
          second: { toGeoJSON: () => secondRemovedElement },
        };
        const wrapper = getWrapper({ onHearingChange: mockOnHearingChange, hearing: { geojson: mockCollection } });

        expect(wrapper.state('isEdited')).toBe(false);
        wrapper.instance().onDrawDeleted(getEvent(eventObject));
        expect(wrapper.state('isEdited')).toBe(true);
        expect(mockOnHearingChange).toHaveBeenCalledWith('geojson', expectedObject);
      });

      test('call onHearingChange with correct params when the last element has been removed from a collection', () => {
        // expected call params are geojson and {}
        const mockCollection = mockFeatureCollection();
        const eventObject = {
          first: { toGeoJSON: () => mockCollection.features[0] },
          second: { toGeoJSON: () => mockCollection.features[1] },
          third: { toGeoJSON: () => mockCollection.features[2] },
          fourth: { toGeoJSON: () => mockCollection.features[3] },
        };
        const wrapper = getWrapper({ onHearingChange: mockOnHearingChange, hearing: { geojson: mockCollection } });
        wrapper.instance().onDrawDeleted(getEvent(eventObject));
        expect(mockOnHearingChange).toHaveBeenCalledWith('geojson', {});
      });
    });
  });
});
