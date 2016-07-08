import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {
  fetchHearing, fetchSectionComments, followHearing,
  postSectionComment, postVote
} from 'actions';
import CommentList from 'components/CommentList';
import LabelList from 'components/LabelList';
import HearingImageList from 'components/HearingImageList';
import SectionList from 'components/SectionList';
import Section from 'components/Section';
import Sidebar from './Sidebar';
import find from 'lodash/find';
import _ from 'lodash';
import Icon from 'utils/Icon';
import {isSpecialSectionType, userCanComment} from 'utils/section';
import LoadSpinner from 'components/LoadSpinner';
import config from 'config';

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
    return dispatch(fetchHearing(params.hearingId, location.query.preview));
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
    const {dispatch, params, location} = this.props;
    Hearing.fetchData(dispatch, null, location, params);
  }

  onPostHearingComment(text, authorName, pluginData = null) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    const {authCode} = this.props.location.query;
    const mainSection = find(this.props.hearing[hearingId].data.sections, (section) => section.type === "main");
    dispatch(postSectionComment(hearingId, mainSection.id, text, authorName, pluginData, authCode));
  }

  onPostSectionComment(sectionId, text, authorName, pluginData) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    const {authCode} = this.props.location.query;
    dispatch(postSectionComment(hearingId, sectionId, text, authorName, pluginData, authCode));
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
          <Icon name="bell-o"/> <FormattedMessage id="follow"/>
        </Button>
      </span>
    );
  }

  getClosureInfo(hearing) {
    const {formatMessage} = this.props.intl;
    const closureInfo = find(hearing.sections, (section) => section.type === "closure-info");
    if (closureInfo) {
      return closureInfo;
    }
    // Render default closure info if no custom section is specified
    return ({ type: "closure-info",
      title: "",
      abstract: "",
      images: [],
      content: formatMessage({id: 'defaultClosureInfo'}) }
    );
  }

  render() {
    const {hearingId} = this.props.params;
    const {state, data: hearing} = (this.props.hearing[hearingId] || {state: 'initial'});
    const {user} = this.props;

    if (state !== 'done') {
      return (<div className="container">
        <LoadSpinner />
      </div>);
    }
    let userIsAdmin = false;
    if (hearing && user && _.has(user, 'adminOrganizations')) {
      userIsAdmin = _.includes(user.adminOrganizations, hearing.organization);
    }
    const hearingAllowsComments = !hearing.closed && (new Date() < new Date(hearing.close_at));
    const onPostVote = this.onVoteComment.bind(this);
    const mainSection = find(hearing.sections, (section) => section.type === "main");
    const mainSectionCommentable = hearingAllowsComments
      && userCanComment(user, mainSection)
      && !mainSection.plugin_identifier; // comment box not available for plugins
    const closureInfoSection = this.getClosureInfo(hearing);
    const regularSections = hearing.sections.filter((section) => !isSpecialSectionType(section.type));
    const sectionGroups = groupSections(regularSections);
    const reportUrl = config.apiBaseUrl + "/v1/hearing/" + hearingId + '/report';

    return (<div className="container">
      <Helmet title={hearing.title} meta={this.getOpenGraphMetaData(hearing)} />
      <LabelList className="main-labels" labels={hearing.labels}/>
      <h1 className="page-title">
        {this.getFollowButton()}
        {!hearing.published ? <Icon name="eye-slash"/> : null}
        {hearing.title}
      </h1>
      <Row>
        <Sidebar hearing={hearing} mainSection={mainSection} sectionGroups={sectionGroups}/>
        <Col md={8} lg={9}>
          <div id="hearing">
            <div>
              <HearingImageList images={mainSection.images}/>
              <div className="hearing-abstract" dangerouslySetInnerHTML={{__html: hearing.abstract}}/>
            </div>
            {hearing.closed ? <Section section={closureInfoSection} canComment={false}/> : null}
            {mainSection ? <Section
              section={mainSection}
              canComment={mainSectionCommentable}
              onPostComment={this.onPostSectionComment.bind(this)}
              loadSectionComments={this.loadSectionComments.bind(this)}
              user={user}
            /> : null}
          </div>
          {sectionGroups.map((sectionGroup) => (
            <div id={"hearing-sectiongroup-" + sectionGroup.type} key={sectionGroup.type}>
              <SectionList
                sections={sectionGroup.sections}
                nComments={sectionGroup.n_comments}
                canComment={hearingAllowsComments}
                onPostComment={this.onPostSectionComment.bind(this)}
                canVote={user !== null}
                onPostVote={onPostVote}
                loadSectionComments={this.loadSectionComments.bind(this)}
                sectionComments={this.props.sectionComments}
                user={user}
              />
            </div>
          ))}
          <div id="hearing-comments">
            <CommentList
              displayVisualization={userIsAdmin || hearing.closed}
              section={mainSection}
              comments={this.props.sectionComments[mainSection.id] ?
                        this.props.sectionComments[mainSection.id].data : []}
              canComment={mainSectionCommentable}
              onPostComment={this.onPostHearingComment.bind(this)}
              canVote={user !== null}
              onPostVote={onPostVote}
              canSetNickname={user === null}
            />
          </div>
          <hr/>
          <a href={reportUrl}><FormattedMessage id="downloadReport"/></a>
        </Col>
      </Row>
    </div>);
  }
}

Hearing.propTypes = {
  intl: intlShape.isRequired,
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

function groupSections(sections) {
  const sectionGroups = [];
  sections.forEach((section) => {
    const sectionGroup = find(sectionGroups, group => section.type === group.type);
    if (sectionGroup) {
      sectionGroup.sections.push(section);
      sectionGroup.n_comments += section.n_comments;
    } else {
      sectionGroups.push({
        name_singular: section.type_name_singular,
        name_plural: section.type_name_plural,
        type: section.type,
        sections: [section],
        n_comments: section.n_comments,
      });
    }
  });
  return sectionGroups;
}
