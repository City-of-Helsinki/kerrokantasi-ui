import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import {injectIntl, FormattedMessage} from 'react-intl';
import {fetchHearing, fetchSectionComments, followHearing, postHearingComment, postSectionComment, postVote} from 'actions';
import CommentList from 'components/CommentList';
import LabelList from 'components/LabelList';
import HearingImageList from 'components/HearingImageList';
import SectionList from 'components/SectionList';
import Section from 'components/Section';
import Sidebar from './Sidebar';
import detect from 'lodash/collection/detect';
import Icon from 'utils/Icon';

class Hearing extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the Hearing view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @param getState Redux state getter
   * @param location Router location
   * @param params Router params
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch, getState, location, params) {
    return dispatch(fetchHearing(params.hearingId));
  }

  /**
   * Return truthy if the view can be rendered fully with the data currently
   * acquirable by `getState()`.
   *
   * @param getState State getter
   * @param location Router location
   * @param params Router params
   * @return {boolean} Renderable?
   */
  static canRenderFully(getState, location, params) {
    const {state, data} = (getState().hearing[params.hearingId] || {state: 'initial'});
    return (state === 'done' && data);
  }

  componentDidMount() {
    const {dispatch, params} = this.props;
    Hearing.fetchData(dispatch, null, null, params);
  }

  onPostHearingComment(text) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postHearingComment(hearingId, {content: text}));
  }

  onPostSectionComment(sectionId, text) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postSectionComment(hearingId, sectionId, {content: text}));
  }

  onVoteComment(commentId, sectionId) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postVote(commentId, hearingId, sectionId));
  }

  onFollowHearing() {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(followHearing(hearingId));
  }

  loadSectionComments(sectionId) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(fetchSectionComments(hearingId, sectionId));
  }

  getOpenGraphMetaData(data) {
    let hostname = "http://kerrokantasi.hel.fi";
    if (typeof HOSTNAME === 'string') {
      hostname = HOSTNAME;  // eslint-disable-line no-undef
    } else if (typeof window !== 'undefined') {
      hostname = window.location.protocol + "//" + window.location.host;
    }
    const url = hostname + this.props.location.pathname;
    return [
      {property: "og:url", content: url},
      {property: "og:type", content: "website"},
      {property: "og:title", content: data.title}
      // TODO: Add description and image?
    ];
  }

  getFollowButton() {
    if (this.props.user === null) {
      return null;
    }
    return (
      <span className="pull-right">
        <Button bsStyle="primary" onClick={this.onFollowHearing.bind(this)}>
          <Icon name="bell-o" /> <FormattedMessage id="follow"/>
        </Button>
      </span>
    );
  }

  render() {
    const {hearingId} = this.props.params;
    const {state, data: hearing} = (this.props.hearing[hearingId] || {state: 'initial'});
    const {user} = this.props;

    if (state !== 'done') {
      return (<div className="container">
        <i>Loading...</i>
      </div>);
    }
    const hearingAllowsComments = !hearing.closed && (new Date() < new Date(hearing.close_at));
    const onPostVote = this.onVoteComment.bind(this);
    const introSection = detect(hearing.sections, (section) => section.type === "introduction");
    const regularSections = hearing.sections.filter((section) => section.type !== "introduction");
    return (<div className="container">
      <Helmet title={hearing.title} meta={this.getOpenGraphMetaData(hearing)} />
      <Sidebar hearing={hearing} />
      <Col xs={12} sm={9}>
        <div id="hearing">
          <LabelList labels={hearing.labels}/>
          <div>
            <h1>{this.getFollowButton()} {hearing.title}</h1>
            <HearingImageList images={hearing.images}/>
            <div className="hearing-abstract" dangerouslySetInnerHTML={{__html: hearing.abstract}}/>
          </div>
          {introSection ? <Section section={introSection} canComment={false} /> : null}
        </div>
        <hr/>
        <div id="hearing-sections">
          <SectionList
           sections={regularSections}
           canComment={hearingAllowsComments}
           onPostComment={this.onPostSectionComment.bind(this)}
           canVote={user !== null}
           onPostVote={onPostVote}
           loadSectionComments={this.loadSectionComments.bind(this)}
           sectionComments={this.props.sectionComments}
          />
        </div>
        <div id="hearing-comments">
          <CommentList
           comments={hearing.comments}
           canComment={hearingAllowsComments}
           onPostComment={this.onPostHearingComment.bind(this)}
           canVote={user !== null}
           onPostVote={onPostVote}
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
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
};

const WrappedHearing = connect((state) => ({
  user: state.user,
  hearing: state.hearing,
  sectionComments: state.sectionComments,
  language: state.language
}))(injectIntl(Hearing));
// We need to re-hoist the data statics to the wrapped component due to react-intl:
WrappedHearing.canRenderFully = Hearing.canRenderFully;
WrappedHearing.fetchData = Hearing.fetchData;
export default WrappedHearing;
