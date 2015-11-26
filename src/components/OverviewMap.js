import React from 'react';
import isNumber from 'lodash/lang/isNumber';

class OverviewMap extends React.Component {
  render() {
    if (typeof window === "undefined") return null;
    const {latitude, longitude, geojson} = this.props;
    const {Map, Marker, TileLayer, GeoJson} = require('react-leaflet');  // Late import to be isomorphic compatible
    let content = null;
    const position = [latitude || 60.192059, longitude || 24.945831];  // Default to Helsinki's center
    if (geojson) {
      content = <GeoJson data={geojson}/>;
    } else if (isNumber(latitude) && isNumber(longitude)) {
      content = <Marker position={position}/>;
    }
    if (!content) {
      return null;
    }
    const style = {width: '100%', height: '240px'};
    return (
      <Map center={position} zoom={13} style={style}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {content}
      </Map>);
  }
}

OverviewMap.propTypes = {
  latitude: React.PropTypes.number,
  longitude: React.PropTypes.number,
  geojson: React.PropTypes.object
};

export default OverviewMap;
