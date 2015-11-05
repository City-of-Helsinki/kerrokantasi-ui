import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import Badge from 'react-bootstrap/lib/Badge';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage} from 'react-intl';
import {Map, Marker, TileLayer} from 'react-leaflet';
import {fetchHearing} from 'actions';
import Comment from './Comment';
import Scenario from './Scenario';

class Hearing extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(fetchHearing(hearingId));
  }

  getLabels() {
    const {hearingId} = this.props.params;
    const {data} = this.props.hearing[hearingId];
    return (<div>{data.labels.map((label) => <Label key={label}>{label}</Label>)}</div>);
  }

  getScenarios() {
    return (<div id="hearing-scenarios">
      <h2><FormattedMessage id="hearing-scenarios"/></h2>
      <div>
        <Scenario sourceId="abcdef123"/>
        <Scenario sourceId="abcd1234"/>
        <Scenario sourceId="123abcdef"/>
      </div>
    </div>);
  }

  getComments() {
    return (<div id="hearing-comments">
              <h2><FormattedMessage id="comments"/></h2>
              <Comment sourceId="abcdef123"/>
              <Comment sourceId="123abcdef"/>
            </div>);
  }

  getOverviewMap() {
    const {hearingId} = this.props.params;
    const {data} = this.props.hearing[hearingId];
    if (data.latitude === "" || data.longitude === "") return null;
    const position = [data.latitude, data.longitude];
    const style = {height: '200px'};
    return (<div>
      <h4><FormattedMessage id="overview-map"/></h4>
      <Map center={position} zoom={13} style={style}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}/>
        </Map>
      </div>
    );
  }

  render() {
    const {hearingId} = this.props.params;
    const {state, data} = (this.props.hearing[hearingId] || {state: 'initial'});

    if (state !== 'done') {
      return (<div className="container">
        <i>Loading...</i>
      </div>);
    }
    return (<div className="container">
      <Helmet title={data.heading}/>
      <Col xs={6} sm={3}>
        <div>
          <h4><FormattedMessage id="timetable"/></h4>
          <i className="fa fa-clock-o"></i> <FormattedMessage id="closing"/> {data.close_at}

        </div>
        <div>
          <h4><FormattedMessage id="table-of-content"/></h4>
        </div>
        <ButtonGroup vertical>
          <Button href="#hearing"><FormattedMessage id="hearing"/></Button>
          <Button href="#hearing-scenarios"><FormattedMessage id="hearing-scenarios"/> <Badge>3</Badge></Button>
          <Button href="#hearing-comments"><FormattedMessage id="comments"/> <Badge>{data.n_comments}</Badge></Button>
        </ButtonGroup>
        <div>
          <h4><FormattedMessage id="borough"/></h4>
          <Label>{data.borough}</Label>
        </div>
        {this.getOverviewMap()}
      </Col>
      <Col xs={12} sm={9}>
        <div id="hearing">
          {this.getLabels()}
          <div>
            <h1>{data.heading}</h1>
            <img width="100%" src="/assets/carousel.png"/>
            <div className="image-caption">
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </div>
            <div className="hearing-abstract" dangerouslySetInnerHTML={{__html: data.abstract}}/>
          </div>
          <div dangerouslySetInnerHTML={{__html: data.content}} />
        </div>
        <hr/>
        {this.getScenarios()}
        {this.getComments()}
      </Col>
    </div>);
  }
}

Hearing.propTypes = {
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  params: React.PropTypes.object
};

export default connect((state) => ({hearing: state.hearing}))(injectIntl(Hearing));
