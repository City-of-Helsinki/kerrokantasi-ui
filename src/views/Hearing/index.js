import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import Badge from 'react-bootstrap/lib/Badge';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage} from 'react-intl';
import {fetchHearing} from 'actions';
import CommentList from 'src/components/CommentList';
import LabelList from 'src/components/LabelList';
import OverviewMap from 'src/components/OverviewMap';
import ScenarioList from 'src/components/ScenarioList';

class Hearing extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(fetchHearing(hearingId));
  }

  getComments() {
    return (<div id="hearing-comments">
              <h2><FormattedMessage id="comments"/></h2>
              <Comment sourceId="abcdef123"/>
              <Comment sourceId="123abcdef"/>
            </div>);
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
          <Button href="#hearing-scenarios"><FormattedMessage id="hearing-scenarios"/> <Badge>{data.scenarios.length}</Badge></Button>
          <Button href="#hearing-comments"><FormattedMessage id="comments"/> <Badge>{data.n_comments}</Badge></Button>
        </ButtonGroup>
        <div>
          <h4><FormattedMessage id="borough"/></h4>
          <Label>{data.borough}</Label>
        </div>
        <OverviewMap latitude={data.latitude} longitude={data.longitude}/>
      </Col>
      <Col xs={12} sm={9}>
        <div id="hearing">
          <LabelList labels={data.labels}/>
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
        <ScenarioList scenarios={data.scenarios}/>
        <CommentList comments={data.comments}/>
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
