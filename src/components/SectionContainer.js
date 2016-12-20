import React from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-router';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import {
  fetchSectionComments, followHearing,
  postSectionComment, postVote
} from '../actions';
import CommentList from './CommentList';
// import HearingImageList from './HearingImageList';
import LabelList from './LabelList';
import Section from './Section';
// import SectionList from './SectionList';
import Sidebar from '../views/Hearing/Sidebar';
import _ from 'lodash';
import Icon from '../utils/Icon';
import config from '../config';
import {
  acceptsComments,
  getClosureSection,
  getHearingURL,
  getMainSection,
  hasFullscreenMapPlugin
} from '../utils/hearing';
import {
  groupSections,
  isSpecialSectionType,
  userCanComment,
  userCanVote
} from '../utils/section';


class SectionContainer extends React.Component {

  openFullscreen(hearing) {
    this.props.dispatch(push(getHearingURL(hearing, {fullscreen: true})));
  }

  onPostHearingComment(text, authorName) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = this.props.location.query;
    const mainSection = getMainSection(this.props.hearing);
    const commentData = {text, authorName, pluginData: null, authCode, geojson: null, label: null, images: []};
    dispatch(postSectionComment(hearingSlug, mainSection.id, commentData));
  }

  onPostSectionComment(sectionId, sectionCommentData) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = this.props.location.query;
    const commentData = Object.assign({authCode}, sectionCommentData);
    dispatch(postSectionComment(hearingSlug, sectionId, commentData));
  }

  onVoteComment(commentId, sectionId) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    dispatch(postVote(commentId, hearingSlug, sectionId));
  }

  onFollowHearing() {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    dispatch(followHearing(hearingSlug));
  }

  loadSectionComments(sectionId) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    dispatch(fetchSectionComments(hearingSlug, sectionId));
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
    const closureInfo = getClosureSection(hearing);
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

  getLinkToFullscreen(hearing) {
    if (!hasFullscreenMapPlugin(hearing)) {
      return null;
    }
    return (
      <Button bsStyle="primary" bsSize="large" block onClick={() => this.openFullscreen(hearing)}>
        <Icon name="arrows-alt" fixedWidth/>
        <FormattedMessage id="openFullscreenMap"/>
      </Button>
    );
  }

  isMainSectionVotable(user) {
    const hearing = this.props.hearing;
    return acceptsComments(hearing) && userCanVote(user, getMainSection(hearing));
  }

  isMainSectionCommentable(user) {
    const hearing = this.props.hearing;
    const section = getMainSection(hearing);
    return (
      acceptsComments(hearing)
      && userCanComment(user, section)
      && !section.plugin_identifier // comment box not available for sections with plugins
    );
  }

  getCommentList() {
    const hearing = this.props.hearing;
    const mainSection = getMainSection(hearing);
    const user = this.props.user;
    const reportUrl = config.apiBaseUrl + "/v1/hearing/" + this.props.hearingSlug + '/report';
    let userIsAdmin = false;
    if (hearing && user && _.has(user, 'adminOrganizations')) {
      userIsAdmin = _.includes(user.adminOrganizations, hearing.organization);
    }
    if (hasFullscreenMapPlugin(hearing)) {
      return null;
    }
    return (
      <div>
        <div id="hearing-comments">
          <CommentList
           displayVisualization={userIsAdmin || hearing.closed}
           section={mainSection}
           comments={this.props.sectionComments[mainSection.id] ?
                     this.props.sectionComments[mainSection.id].data : []}
           canComment={this.isMainSectionCommentable(hearing, user)}
           onPostComment={this.onPostHearingComment.bind(this)}
           canVote={this.isMainSectionVotable(user)}
           onPostVote={this.onVoteComment.bind(this)}
           canSetNickname={user === null}
          />
        </div>
        <hr/>
        <a href={reportUrl}><FormattedMessage id="downloadReport"/></a>
      </div>
    );
  }

  render() {
    const {hearing, section, user, sectionComments} = this.props;
    // const hearingAllowsComments = acceptsComments(hearing);
    // const closureInfoSection = this.getClosureInfo(hearing);
    // const regularSections = hearing.sections.filter((section) => !isSpecialSectionType(section.type));
    const mainSection = getMainSection(hearing);
    const regularSections = hearing.sections.filter((sect) => !isSpecialSectionType(sect.type));
    const sectionGroups = groupSections(regularSections);
    // const fullscreenMapPlugin = hasFullscreenMapPlugin(hearing);

    return (
      <div id="hearing-wrapper">
        <LabelList className="main-labels" labels={hearing.labels}/>

        <h1 className="page-title">
          {this.getFollowButton()}
          {!hearing.published ? <Icon name="eye-slash"/> : null}
          {hearing.title}
        </h1>

        <Row>
          <Sidebar hearing={hearing} mainSection={mainSection} sectionGroups={sectionGroups}/>
          <Col md={8} lg={9}>
            <Section
              section={section}
              canComment={false}// this.props.canComment && userCanComment(user, section)}
              onPostComment={false}// this.props.onPostComment}
              canVote={false}// this.props.canVote && userCanVote(user, section)}
              onPostVote={false}// this.props.onPostVote}
              comments={sectionComments}// this.props.loadSectionComments}
              user={user}
              isCollapsible={false}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

SectionContainer.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  hearingSlug: React.PropTypes.string,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  section: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
};

export function wrapSectionContainer(component, pure = true) {
  const wrappedComponent = connect(null, null, null, {pure})(injectIntl(component));
  // We need to re-hoist the data statics to the wrapped component due to react-intl:
  wrappedComponent.canRenderFully = component.canRenderFully;
  wrappedComponent.fetchData = component.fetchData;
  return wrappedComponent;
}

export default wrapSectionContainer(SectionContainer);
