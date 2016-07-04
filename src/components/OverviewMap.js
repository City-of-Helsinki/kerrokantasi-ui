import React from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';


class OverviewMap extends React.Component {
  navigateToHearing(id) {
    this.props.dispatch(pushState(null, `/hearing/${id}`));
  }

  getHearingMapContent(hearings) {
    const {Popup, GeoJson} = require('react-leaflet');  // Late import to be isomorphic compatible
    const contents = [];
    hearings.forEach((hearing) => {
      const {geojson, id} = hearing;
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
      }
    });
    return contents;
  }

  render() {
    if (typeof window === "undefined") return null;
    const {style, hearings} = this.props;
    const {Map, TileLayer, FeatureGroup} = require('react-leaflet');  // Late import to be isomorphic compatible
    const contents = this.getHearingMapContent(hearings);
    if (!contents.length && this.props.hideIfEmpty) {
      return null;
    }
    const position = [60.192059, 24.945831];  // Default to Helsinki's center
    return (
      <Map center={position} zoom={13} style={style} minZoom={8}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup
          ref={(input) => {
            if (!input) return;
            const bounds = input.getLeafletElement().getBounds();
            if (bounds.isValid()) {
              input.props.map.fitBounds(bounds);
              const viewportBounds = [
                [59.9, 24.59],  // SouthWest corner
                [60.43, 25.3]  // NorthEast corner
              ];  // Wide Bounds of City of Helsinki area
              input.props.map.setMaxBounds(viewportBounds);
            }
          }}
        >{contents}</FeatureGroup>
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
