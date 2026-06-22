/* eslint-disable react/prop-types */

const MapContainer = ({ children }) => (
  <div data-testid='MapContainer'>{children}</div>
);

const useMap = () => ({ fitBounds: () => {} });

const TileLayer = () => <div data-testid='TileLayer' />;

const Marker = ({ children }) => <div data-testid='Marker'>{children}</div>;

const FeatureGroup = ({ children }) => (
  <div data-testid='FeatureGroup'>{children}</div>
);

const Popup = () => <div data-testid='Popup' />;

export { MapContainer, TileLayer, Marker, FeatureGroup, Popup, useMap };
