import React from 'react';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {
  fetchSectionComments, followHearing,
  postSectionComment, postVote
} from '../actions';
import CommentList from './CommentList';
import LabelList from './LabelList';
import HearingImageList from './HearingImageList';
import SectionList from './SectionList';
import Section from './Section';
import Sidebar from '../views/Hearing/Sidebar';
import find from 'lodash/find';
import _ from 'lodash';
import Icon from '../utils/Icon';
import {isSpecialSectionType, userCanComment, userCanVote} from '../utils/section';
import config from '../config';

class Hearing extends React.Component {

  onPostHearingComment(text, authorName) {
    const {dispatch} = this.props;
    const hearingId = this.props.hearingId;
    const {authCode} = this.props.location.query;
    const mainSection = find(this.props.hearing.sections, (section) => section.type === "main");
    const commentData = {text, authorName, pluginData: null, authCode, geojson: null, label: null, images: []};
    dispatch(postSectionComment(hearingId, mainSection.id, commentData));
  }

  onPostSectionComment(sectionId, sectionCommentData) {
    const {dispatch} = this.props;
    const hearingId = this.props.hearingId;
    const {authCode} = this.props.location.query;
    const commentData = Object.assign({authCode}, sectionCommentData);
    dispatch(postSectionComment(hearingId, sectionId, commentData));
  }

  onVoteComment(commentId, sectionId) {
    const {dispatch} = this.props;
    const hearingId = this.props.hearingId;
    dispatch(postVote(commentId, hearingId, sectionId));
  }

  onFollowHearing() {
    const {dispatch} = this.props;
    const hearingId = this.props.hearingId;
    dispatch(followHearing(hearingId));
  }

  loadSectionComments(sectionId) {
    const {dispatch} = this.props;
    const hearingId = this.props.hearingId;
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
    const hearingId = this.props.hearingId;
    const hearing = this.props.hearing;
    const user = this.props.user;

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
    const mainSectionVotable = hearingAllowsComments && userCanVote(user, mainSection);
    const closureInfoSection = this.getClosureInfo(hearing);
    const regularSections = hearing.sections.filter((section) => !isSpecialSectionType(section.type));
    const sectionGroups = groupSections(regularSections);
    const reportUrl = config.apiBaseUrl + "/v1/hearing/" + hearingId + '/report';

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
                onPostVote={onPostVote}
                canVote={mainSectionVotable}
                loadSectionComments={this.loadSectionComments.bind(this)}
                comments={this.props.sectionComments[mainSection.id]}
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
                  canVote={hearingAllowsComments}
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
                canVote={mainSectionVotable}
                onPostVote={onPostVote}
                canSetNickname={user === null}
              />
            </div>
            <hr/>
            <a href={reportUrl}><FormattedMessage id="downloadReport"/></a>
          </Col>
        </Row>
      </div>
    );
  }
}

Hearing.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  hearingId: React.PropTypes.string,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
};

const WrappedHearing = connect()(injectIntl(Hearing));
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
