import React from 'react';
import {Map, Marker, TileLayer} from 'react-leaflet';
import {FormattedMessage} from 'react-intl';

class OverviewMap extends React.Component {
  render() {
    const {latitude, longitude} = this.props;
    const position = [latitude, longitude];
    const style = {height: '200px'};
    if (latitude === "" || longitude === "") return null;
    return (<div>
      <h4><FormattedMessage id="overview-map"/></h4>
      <Map center={position} zoom={13} style={style}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}/>
      </Map>
    </div>);
  }
}

OverviewMap.propTypes = {
  latitude: React.PropTypes.String,
  longitude: React.PropTypes.String
};

export default OverviewMap;
