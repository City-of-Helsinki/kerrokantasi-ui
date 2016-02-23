import React from 'react';
import isNumber from 'lodash/isNumber';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';


class OverviewMap extends React.Component {
  navigateToHearing(id) {
    this.props.dispatch(pushState(null, `/hearing/${id}`));
  }
  getHearingMapContent(hearings) {
    const {Marker, Popup, GeoJson} = require('react-leaflet');  // Late import to be isomorphic compatible
    let position = null;
    const contents = [];
    hearings.forEach((hearing) => {
      const {latitude, longitude, geojson, id} = hearing;
      const content = (this.props.enablePopups ? (<Popup>
        <div>
          <h4>
            <a href="#" onClick={this.navigateToHearing.bind(this, hearing.id)}>{hearing.title}</a>
          </h4>
          <p>{hearing.abstract}</p>
        </div>
      </Popup>) : null);
      if (geojson) {
        contents.push(<GeoJson key={id} data={geojson}>{content}</GeoJson>);
      } else if (isNumber(latitude) && isNumber(longitude)) {
        contents.push(<Marker key={id} position={[latitude, longitude]}>{content}</Marker>);
      }
    });
    if (position === null) {
      position = [60.192059, 24.945831];  // Default to Helsinki's center
    }
    return {position, contents};
  }

  render() {
    if (typeof window === "undefined") return null;
    const {style, hearings} = this.props;
    const {Map, TileLayer} = require('react-leaflet');  // Late import to be isomorphic compatible
    const {position, contents} = this.getHearingMapContent(hearings);
    if (!contents.length && this.props.hideIfEmpty) {
      return null;
    }
    return (
      <Map center={position} zoom={13} style={style}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {contents}
      </Map>);
  }
}

OverviewMap.propTypes = {
  dispatch: React.PropTypes.func,
  hearings: React.PropTypes.array.isRequired,
  style: React.PropTypes.object,
  hideIfEmpty: React.PropTypes.bool,
  enablePopups: React.PropTypes.bool
};

export default connect()(OverviewMap);
