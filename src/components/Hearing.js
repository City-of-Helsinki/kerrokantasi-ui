import React from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-router';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {Modal} from 'react-bootstrap';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import {
  fetchSectionComments, fetchMoreSectionComments, followHearing,
  postSectionComment, editSectionComment, postVote, deleteSectionComment
} from '../actions';
import SortableCommentList from './SortableCommentList';
import HearingImageList from './HearingImageList';
import LabelList from './LabelList';
import Section from './Section';
import SectionList from './SectionList';
import Sidebar from '../views/Hearing/Sidebar';
import find from 'lodash/find';
import _, {get} from 'lodash';
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
  isSpecialSectionType,
  userCanComment,
  userCanVote
} from '../utils/section';
import getAttr from '../utils/getAttr';

export class Hearing extends React.Component {

  constructor(props) {
    super(props);

    this.state = { showDeleteModal: false, commentToDelete: { } };
  }

  openFullscreen(hearing) {
    this.props.dispatch(push(getHearingURL(hearing, {fullscreen: true})));
  }

  onPostHearingComment(text, authorName, pluginData, geojson, label, images) { // eslint-disable-line
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = this.props.location.query;
    const mainSection = getMainSection(this.props.hearing);
    const commentData = {text, authorName, pluginData: null, authCode, geojson: null, label: null, images};
    dispatch(postSectionComment(hearingSlug, mainSection.id, commentData));
  }

  onPostSectionComment(sectionId, sectionCommentData) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = this.props.location.query;
    const commentData = Object.assign({authCode}, sectionCommentData);
    dispatch(postSectionComment(hearingSlug, sectionId, commentData));
  }

  onEditSectionComment(sectionId, commentId, commentData) {
    const {dispatch} = this.props;
    const hearingSlug = this.props.hearingSlug;
    const {authCode} = this.props.location.query;
    Object.assign({authCode}, commentData);
    dispatch(editSectionComment(hearingSlug, sectionId, commentId, commentData));
  }

  onDeleteComment() {
    const {dispatch} = this.props;
    const {sectionId, commentId} = this.state.commentToDelete;
    const hearingSlug = this.props.hearingSlug;
    dispatch(deleteSectionComment(hearingSlug, sectionId, commentId));
    this.forceUpdate();
  }

  handleDeleteClick(sectionId, commentId) {
    this.setState({ commentToDelete: {sectionId, commentId}});
    this.openDeleteModal();
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
    dispatch(fetchSectionComments(sectionId));
  }

  loadMoreSectionComments(sectionId) {
    const {dispatch, sectionComments} = this.props;
    const commentsObject = get(sectionComments, `${sectionId}`);
    const next = commentsObject && get(commentsObject, 'next');
    console.log('fetchMore', sectionId, commentsObject, sectionComments);
    if (next) {
      const currentOrdering = get(commentsObject, 'ordering');
      dispatch(fetchMoreSectionComments(sectionId, currentOrdering, next));
    }
  }

  // loadSectionComments(sectionId) {
  //   const {dispatch} = this.props;
  //   const hearingSlug = this.props.hearingSlug;
  //   dispatch(fetchSectionComments(hearingSlug, sectionId));
  // }

  getOpenGraphMetaData(data) {
    const {language} = this.props;
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
      {property: "og:title", content: getAttr(data.title, language)}
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
    const {hearing, sectionComments, location, hearingSlug} = this.props;
    const mainSection = getMainSection(hearing);
    const user = this.props.user;
    const reportUrl = config.apiBaseUrl + "/v1/hearing/" + hearingSlug + '/report';
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
          <SortableCommentList
            canVote={this.isMainSectionVotable(user)}
            displayVisualization={userIsAdmin || hearing.closed}
           section={mainSection}
           location={location}
           mainSection={mainSection}
           hearingSlug={hearingSlug}
           comments={sectionComments[mainSection.id] ?
                     sectionComments[mainSection.id].results : []}
           canComment={this.isMainSectionCommentable(hearing, user)}
           onPostComment={this.onPostHearingComment.bind(this)}
           onEditComment={this.onEditSectionComment.bind(this)}
           onDeleteComment={this.handleDeleteClick.bind(this)}
           onPostVote={this.onVoteComment.bind(this)}
           canSetNickname={user === null}
          />
        </div>
        <hr/>
        <a href={reportUrl}><FormattedMessage id="downloadReport"/></a>
      </div>
    );
  }

  openDeleteModal() {
    this.setState({ showDeleteModal: true });
  }

  closeDeleteModal() {
    this.setState({ showDeleteModal: false, commentToDelete: {} });
  }

  render() {
    const {hearing, user, language} = this.props;
    const hearingAllowsComments = acceptsComments(hearing);
    const mainSection = getMainSection(hearing);
    const closureInfoSection = this.getClosureInfo(hearing);
    const regularSections = hearing.sections.filter((section) => !isSpecialSectionType(section.type));
    const sectionGroups = groupSections(regularSections);
    const fullscreenMapPlugin = hasFullscreenMapPlugin(hearing);

    return (
      <div id="hearing-wrapper">
        <LabelList className="main-labels" labels={hearing.labels}/>

        <h1 className="page-title">
          {this.getFollowButton()}
          {!hearing.published ? <Icon name="eye-slash"/> : null}
          {getAttr(hearing.title, language)}
        </h1>

        <Row>
          <Sidebar hearing={hearing} mainSection={mainSection} sectionGroups={sectionGroups}/>
          <Col md={8} lg={9}>
            <div id="hearing">
              <div>
                <HearingImageList images={mainSection.images}/>
                <div className="hearing-abstract lead" dangerouslySetInnerHTML={{__html: getAttr(hearing.abstract, language)}}/>
              </div>
              {hearing.closed ? <Section section={closureInfoSection} canComment={false}/> : null}
              {mainSection ? <Section
                showPlugin={!fullscreenMapPlugin}
                section={mainSection}
                canComment={this.isMainSectionCommentable(hearing, user)}
                onPostComment={this.onPostSectionComment.bind(this)}
                onPostVote={this.onVoteComment.bind(this)}
                canVote={this.isMainSectionVotable(user)}
                loadSectionComments={this.loadSectionComments.bind(this)}
                comments={this.props.sectionComments[mainSection.id]}
                user={user}
              /> : null}
            </div>

            {this.getLinkToFullscreen(hearing)}

            {sectionGroups.map((sectionGroup) => (
              <div id={"hearing-sectiongroup-" + sectionGroup.type} key={sectionGroup.type}>
                <SectionList
                  sections={sectionGroup.sections}
                  nComments={sectionGroup.n_comments}
                  canComment={hearingAllowsComments}
                  onPostComment={this.onPostSectionComment.bind(this)}
                  canVote={hearingAllowsComments}
                  onPostVote={this.onVoteComment.bind(this)}
                  loadSectionComments={this.loadSectionComments.bind(this)}
                  sectionComments={this.props.sectionComments}
                  user={user}
                />
              </div>
            ))}
            {this.getCommentList()}
          </Col>
        </Row>
        <DeleteModal
          isOpen={this.state.showDeleteModal}
          close={this.closeDeleteModal.bind(this)}
          onDeleteComment={this.onDeleteComment.bind(this)}
        />
      </div>
    );
  }
}

Hearing.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  hearingSlug: React.PropTypes.string,
  language: React.PropTypes.string,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
};

export function wrapHearingComponent(component, pure = true) {
  const wrappedComponent = connect((state) => ({language: state.language}), null, null, {pure})(injectIntl(component));
  // We need to re-hoist the data statics to the wrapped component due to react-intl:
  wrappedComponent.canRenderFully = component.canRenderFully;
  wrappedComponent.fetchData = component.fetchData;
  return wrappedComponent;
}

export default wrapHearingComponent(Hearing);

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

const DeleteModal = ({ isOpen, close, onDeleteComment }) =>
  <Modal className="delete-modal" show={isOpen} onHide={() => close()} animation={false}>
    <Modal.Header closeButton>
      <Modal.Title><FormattedMessage id="deleteConfirmation"/></Modal.Title>
    </Modal.Header>
    <Modal.Footer>
      <Button onClick={() => close()}><FormattedMessage id="cancel"/></Button>
      <Button bsStyle="danger" onClick={() => { onDeleteComment(); close(); }}><FormattedMessage id="deleteComment"/></Button>
    </Modal.Footer>
  </Modal>;

DeleteModal.propTypes = {
  isOpen: React.PropTypes.boolean,
  close: React.PropTypes.func,
  onDeleteComment: React.PropTypes.func
};
