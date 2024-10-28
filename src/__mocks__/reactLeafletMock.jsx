/* eslint-disable react/prop-types */
import React from 'react';

const MapContainer = ({ children }) => <div data-testId='MapContainer'>{children}</div>;

const useMap = () => ({ fitBounds: () => {} });

const TileLayer = () => <div data-testId='TileLayer' />;

const Marker = ({ children }) => <div data-testId='Marker'>{children}</div>;

const FeatureGroup = ({ children }) => <div data-testId='FeatureGroup'>{children}</div>;

const Popup = () => <div data-testId='Popup' />;

export { MapContainer, TileLayer, Marker, FeatureGroup, Popup, useMap };
