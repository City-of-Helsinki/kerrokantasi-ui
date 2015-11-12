import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import Badge from 'react-bootstrap/lib/Badge';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage, FormattedRelative} from 'react-intl';
import {fetchHearing, fetchScenarioComments, followHearing, postHearingComment, postScenarioComment, postVote} from 'actions';
import CommentList from 'components/CommentList';
import LabelList from 'components/LabelList';
import OverviewMap from 'components/OverviewMap';
import HearingImageList from 'components/HearingImageList';
import ScenarioList from 'components/ScenarioList';

class Hearing extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(fetchHearing(hearingId));
  }

  onPostHearingComment(text) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postHearingComment(hearingId, {content: text}));
  }

  onPostScenarioComment(scenarioId, text) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postScenarioComment(hearingId, scenarioId, {content: text}));
  }

  onVoteComment(commentId, scenarioId) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postVote(commentId, hearingId, scenarioId));
  }

  onFollowHearing() {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(followHearing(hearingId));
  }

  loadScenarioComments(scenarioId) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(fetchScenarioComments(hearingId, scenarioId));
  }

  render() {
    const {hearingId} = this.props.params;
    const {state, data} = (this.props.hearing[hearingId] || {state: 'initial'});
    const {user} = this.props;

    if (state !== 'done') {
      return (<div className="container">
        <i>Loading...</i>
      </div>);
    }
    return (<div className="container">
      <Helmet title={data.heading}/>
      <Col xs={6} sm={3}>
        <div className="hearing-sidebar">
          <div>
            <h4><FormattedMessage id="timetable"/></h4>
            <i className="fa fa-clock-o"></i> <FormattedMessage id="closing"/> <FormattedRelative value={data.close_at}/>
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
        </div>
      </Col>
      <Col xs={12} sm={9}>
        <div id="hearing">
          <LabelList labels={data.labels}/>
          <div>
            <h1>
              {user !== null ? (<span className="pull-right">
                <Button bsStyle="primary" onClick={this.onFollowHearing.bind(this)}>
                  <i className="fa fa-bell-o"/> <FormattedMessage id="follow"/>
                </Button>
               </span>) : null}
              {data.heading}</h1>
            <HearingImageList images={data.images}/>
            <div className="hearing-abstract" dangerouslySetInnerHTML={{__html: data.abstract}}/>
          </div>
          <div dangerouslySetInnerHTML={{__html: data.content}} />
        </div>
        <hr/>
        <div id="hearing-scenarios">
          <ScenarioList
           scenarios={data.scenarios}
           canComment={!data.closed && (new Date() < new Date(data.close_at))}
           onPostComment={this.onPostScenarioComment.bind(this)}
           canVote={user !== null}
           onPostVote={this.onVoteComment.bind(this)}
           loadScenarioComments={this.loadScenarioComments.bind(this)}
           scenarioComments={this.props.scenarioComments}
          />
        </div>
        <div id="hearing-comments">
          <CommentList
           comments={data.comments}
           canComment={!data.closed && (new Date() < new Date(data.close_at))}
           onPostComment={this.onPostHearingComment.bind(this)}
           canVote={user !== null}
           onPostVote={this.onVoteComment.bind(this)}
          />
        </div>
      </Col>
    </div>);
  }
}

Hearing.propTypes = {
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  params: React.PropTypes.object,
  user: React.PropTypes.object,
  scenarioComments: React.PropTypes.object,
};

export default connect((state) => ({
  user: state.user,
  hearing: state.hearing,
  scenarioComments: state.scenarioComments,
  language: state.language
}))(injectIntl(Hearing));
