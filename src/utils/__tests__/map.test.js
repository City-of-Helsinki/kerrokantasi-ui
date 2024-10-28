import React from 'react';
import { render } from '@testing-library/react';

import { getCorrectContrastMapTileUrl, getMapElement } from '../map';
// Mocking leaflet and react-leaflet
jest.mock('leaflet', () => ({
  LatLng: jest.fn((lat, lng) => ({ lat, lng })),
  Icon: jest.fn(() => ({})),
}));

jest.mock('proj4', () => ({}));
jest.mock('proj4leaflet', () => ({}));

jest.mock('react-leaflet', () => ({
    Polygon: jest.fn(({ positions }) => <div data-testid="Polygon">{JSON.stringify(positions)}</div>),
    GeoJSON: jest.fn(({ data }) => <div data-testid="GeoJSON">{JSON.stringify(data)}</div>),
    Marker: jest.fn(({ position }) => <div data-testid="Marker">{JSON.stringify(position)}</div>),
    Polyline: jest.fn(({ positions }) => <div data-testid="Polyline">{JSON.stringify(positions)}</div>),
  }));

const NORMAL_URL_PNG = "normal url.png";

describe('getCorrectContrastMapTileUrl', () => {
  describe('should return normal map tiles', () => {
    it.skip('when high contrast mode is not enabled', () => {
      const isHighContrastModeEnabled = false;
      const normalMapTileUrl = NORMAL_URL_PNG;
      const highContrastMapTileUrl = "high contrast url.png";
      const language = "fi";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language)).toBe("normal url@fi.png");
    });
    it.skip('when high contrast map tile url doesnt exist', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = NORMAL_URL_PNG;
      const highContrastMapTileUrl = undefined;
      const language = "fi";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language)).toBe("normal url@fi.png");
    });
  });

  describe('should return high contrast map tiles', () => {
    it.skip('when high contrast mode is enabled and high contrast map tile url exists', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = NORMAL_URL_PNG;
      const highContrastMapTileUrl = "high contrast url.png";
      const language = "fi";

      expect(
        getCorrectContrastMapTileUrl(normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language))
        .toBe("high contrast url@fi.png");
    });
  });
});

describe('getMapElement', () => {
  it('returns null for null geojson', () => {
    const element = getMapElement(null);
    expect(element).toBeNull();
  });

  it('renders Polygon for Polygon geojson', () => {
    const geojson = {
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 1], [2, 2]]],
    };
    const { getByTestId } = render(getMapElement(geojson));
    expect(getByTestId('Polygon')).toHaveTextContent(
      JSON.stringify([{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }, { lat: 2, lng: 2 }])
    );
  });

  it('renders multiple Polygons for MultiPolygon geojson', () => {
    const geojson = {
      type: 'MultiPolygon',
      coordinates: [
        [[[0, 0], [1, 1], [2, 2]]],
        [[[3, 3], [4, 4], [5, 5]]],
      ],
    };
    const { getAllByTestId } = render(<div>{getMapElement(geojson)}</div>);
    const polygons = getAllByTestId('Polygon');
    expect(polygons[0]).toHaveTextContent(
      JSON.stringify([{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }, { lat: 2, lng: 2 }])
    );
    expect(polygons[1]).toHaveTextContent(
      JSON.stringify([{ lat: 3, lng: 3 }, { lat: 4, lng: 4 }, { lat: 5, lng: 5 }])
    );
  });

  it('renders Marker for Point geojson', () => {
    const geojson = {
      type: 'Point',
      coordinates: [0, 0],
    };
    const { getByTestId } = render(getMapElement(geojson));
    expect(getByTestId('Marker')).toHaveTextContent(JSON.stringify({ lat: 0, lng: 0 }));
  });

  it('renders Polyline for LineString geojson', () => {
    const geojson = {
      type: 'LineString',
      coordinates: [[0, 0], [1, 1], [2, 2]],
    };
    const { getByTestId } = render(getMapElement(geojson));
    expect(getByTestId('Polyline')).toHaveTextContent(
      JSON.stringify([{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }, { lat: 2, lng: 2 }])
    );
  });

  it('recursively renders Feature geojson', () => {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
    };
    const { getByTestId } = render(getMapElement(geojson));
    expect(getByTestId('Marker')).toHaveTextContent(JSON.stringify({ lat: 0, lng: 0 }));
  });

  it('renders FeatureCollection geojson', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [[0, 0], [1, 1], [2, 2]],
          },
        },
      ],
    };
    const { getByTestId, getAllByTestId } = render(<div>{getMapElement(geojson)}</div>);
    expect(getByTestId('Marker')).toHaveTextContent(JSON.stringify({ lat: 0, lng: 0 }));
    expect(getAllByTestId('Polyline')[0]).toHaveTextContent(
      JSON.stringify([{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }, { lat: 2, lng: 2 }])
    );
  });

  it('renders GeoJSON for unsupported geojson type', () => {
    const geojson = {
      type: 'UnsupportedType',
      coordinates: [],
    };
    const { getByTestId } = render(getMapElement(geojson));
    expect(getByTestId('GeoJSON')).toHaveTextContent(JSON.stringify(geojson));
  });
});
