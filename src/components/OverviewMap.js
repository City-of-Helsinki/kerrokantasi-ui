/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import {getHearingURL} from '../utils/hearing';
import getAttr from '../utils/getAttr';
import bbox from '@turf/bbox';
import center from '@turf/center'
import ReactMapboxGl, {ZoomControl, Popup, Layer, Feature} from "react-mapbox-gl";
//import Leaflet, { LatLng } from 'leaflet';
//import { Polygon, Marker, Polyline, Map, TileLayer, FeatureGroup, Popup, GeoJSON } from 'react-leaflet';
// eslint-disable-next-line import/no-unresolved
import localization from '@city-i18n/localization.json';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

class OverviewMap extends React.Component {
  state = {
    height: this.props.showOnCarousel ? null : this.props.style.height,
    width: this.props.showOnCarousel ? null : this.props.style.width,
    selected: null
  }

  // componentDidMount = () => {
  //   window.addEventListener("resize", this.updateDimensions);
  // }

  // componentWillUnmount = () => {
  //   window.removeEventListener("resize", this.updateDimensions);
  // }

  // componentWillReceiveProps = (nextProps) => {
  //   if (
  //     nextProps.mapContainer
  //     && typeof nextProps.mapContainer !== 'undefined'
  //     && nextProps.mapContainer.getBoundingClientRect()) {
  //     this.handleUpdateMapDimensions(nextProps.mapContainer);
  //   }
  // }

  // updateDimensions = () => {
  //   this.handleUpdateMapDimensions(this.props.mapContainer);
  // }

  // /**
  //  * The react-leaflet requires static width and height to display properly, attach listener.
  //  * @param {Object} mapContainer - Container enclosing the map
  //  */
  // handleUpdateMapDimensions = (mapContainer) => {
  //   if (mapContainer) {
  //     const { width, height } = mapContainer.getBoundingClientRect();
  //     if (width > 0 && height > 0) {
  //       this.setState({ width: `${width}px`, height: `${height}px`});
  //     }
  //   }
  // }

  // /**
  //  * ensures whether it is the right time to render map.
  //  * In case of carousel, we require static width and height.
  //  * @returns {Bool}
  //  */
  // shouldMapRender = () => (
  //   this.props.showOnCarousel ? (this.state.height && this.state.width) : true
  // );

  featureClick(hearing) {
    this.setState({selected: hearing});
  }

  getHearingMapContent(hearings) {
    const points = []
    const polygons = []

    hearings.forEach((hearing) => {
      const {geojson} = hearing;

      if (geojson) {
        switch (geojson.type) {
          case "Polygon": {
            // XXX: This only supports the _first_ ring of coordinates in a Polygon
            polygons.push(<Feature
              coordinates={geojson.coordinates[0]}
              onClick={this.featureClick.bind(this, hearing)}
              />);
          }
            break;
          case "Point": {
            points.push(<Feature
              coordinates={geojson.coordinates[0]}
              onClick={this.featureClick.bind(this, hearing)}
              />)
          }
            break;
          default:
          // TODO: Implement support for other geometries too (markers, square, circle)
        }
      }
    });
    console.log('got content for map:')
    console.log(points)
    console.log(polygons)
    return (
      <div>
        <Layer type="symbol">{points}</Layer>
        <Layer type="fill">{polygons}</Layer>
      </div>
    );
  }

  getBbox(hearings) {
    if (!hearings.length) {
      return null;
    }
    const filteredHearings = hearings.filter((hearing) => hearing.geojson)
    return bbox({type: "FeatureCollection", features: filteredHearings.map((hearing) => hearing.geojson)});
  }

  render() {
    console.log('rendering with hearings:');
    if (typeof window === "undefined") return null;
    const { hearings} = this.props;
    console.log(hearings);
    const selectedHearing = this.state.selected;
    const contents = this.getHearingMapContent(hearings);
    if (!contents.length && this.props.hideIfEmpty) {
       return null;
    }
    const bbox = this.getBbox(hearings);
    const Map = ReactMapboxGl({
      minZoom: 8,
    });
    console.log('rendering map')
    return (
      //this.shouldMapRender() &&
      <Map
        style='http://tiles.hel.ninja/styles/hel-osm-bright/style.json'
        //ref={this.refCallBack}
        // onResize={this.invalidateMap.bind(this)}
        //zoomControl={false}
        center={[localization.mapPosition[1], localization. mapPosition[0]]}
        zoom={[11]}
        containerStyle={{ ...this.state }}
        //className="hearing-map"
        fitBounds={bbox}
        fitBoundsOptions={{padding: 50}}
      >
        {contents}
        {this.props.enablePopups && selectedHearing &&   
          <Popup key={selectedHearing.slug} coordinates={center(selectedHearing.geojson.coordinates[0])}>
          <div>
            <h4>
              <a href={getHearingURL(selectedHearing)}>{getAttr(selectedHearing.title, language)}</a>
            </h4>
            <p>{getAttr(selectedHearing.abstract, language)}</p>
          </div>
          </Popup>
        }
      </Map>
      // <Map center={localization.mapPosition} zoom={10} style={{ ...this.state }} minZoom={8} scrollWheelZoom={false}>
      //   <TileLayer
      //     url={urls.rasterMapTiles}
      //     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      //   />
      /*
        <FeatureGroup
          ref={(input) => {
            if (!input) return;
            const bounds = input.leafletElement.getBounds();
            if (bounds.isValid()) {
              input.context.map.fitBounds(bounds);
              // const viewportBounds = [
              //   [59.9, 24.59],  // SouthWest corner
              //   [60.43, 25.3]  // NorthEast corner
              // ];  // Wide Bounds of City of Helsinki area
              // input.context.map.setMaxBounds(viewportBounds);
            }
          }}
        > 
          <div>{contents}</div>
        </FeatureGroup>*/
      //;
    )
  }
}

OverviewMap.propTypes = {
  hearings: PropTypes.array.isRequired,
  style: PropTypes.object,
  hideIfEmpty: PropTypes.bool,
  enablePopups: PropTypes.bool,
  showOnCarousel: PropTypes.bool,
  mapContainer: PropTypes.object,
};

OverviewMap.contextTypes = {
  language: PropTypes.string.isRequired,
};

OverviewMap.defaultProps = {
  showOnCarousel: false,
  mapContainer: undefined,
};

export default OverviewMap;
