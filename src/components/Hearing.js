import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import { Button, Col, Row, Tooltip } from 'react-bootstrap';
import DeleteModal from './DeleteModal';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import ContactCard from './ContactCard';
import Waypoint from 'react-waypoint';
import config from '../config';
import moment from 'moment';

import { followHearing, postSectionComment, editSectionComment, postVote, deleteSectionComment } from '../actions';
import SortableCommentList from './SortableCommentList';
import HearingImageList from './HearingImageList';
import WrappedSection from './Section';
import SectionList from './SectionList';
import Sidebar from '../views/Hearing/Sidebar';
import Header from '../views/Hearing/Header';
import _, { find } from 'lodash';
import Icon from '../utils/Icon';
import {
  acceptsComments,
  getClosureSection,
  getHearingEditorURL,
  getHearingURL,
  getMainSection,
  hasFullscreenMapPlugin,
} from '../utils/hearing';
import { isSpecialSectionType, userCanComment, userCanVote } from '../utils/section';
import getAttr from '../utils/getAttr';

export class Hearing extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showDeleteModal: false, commentToDelete: {} };
  }

  openFullscreen(hearing) {
    this.props.dispatch(push(getHearingURL(hearing, { fullscreen: true })));
  }

  toHearingEditor(hearing) {
    this.props.dispatch(push(getHearingEditorURL(hearing)));
  }

  onPostHearingComment(text, authorName, pluginData, geojson, label, images) {
    // eslint-disable-line
    const { dispatch } = this.props;
    const hearingSlug = this.props.hearingSlug;
    const { authCode } = this.props.location.query;
    const mainSection = getMainSection(this.props.hearing);
    const commentData = { text, authorName, pluginData: null, authCode, geojson: null, label: null, images };
    dispatch(postSectionComment(hearingSlug, mainSection.id, commentData));
  }

  onPostSectionComment(sectionId, sectionCommentData) {
    const { dispatch } = this.props;
    const hearingSlug = this.props.hearingSlug;
    const { authCode } = this.props.location.query;
    const commentData = Object.assign({ authCode }, sectionCommentData);
    dispatch(postSectionComment(hearingSlug, sectionId, commentData));
  }

  onEditSectionComment(sectionId, commentId, commentData) {
    const { dispatch } = this.props;
    const hearingSlug = this.props.hearingSlug;
    const { authCode } = this.props.location.query;
    Object.assign({ authCode }, commentData);
    dispatch(editSectionComment(hearingSlug, sectionId, commentId, commentData));
  }

  onDeleteComment() {
    const { dispatch } = this.props;
    const { sectionId, commentId } = this.state.commentToDelete;
    const hearingSlug = this.props.hearingSlug;
    dispatch(deleteSectionComment(hearingSlug, sectionId, commentId));
    this.forceUpdate();
  }

  handleDeleteClick(sectionId, commentId) {
    this.setState({ commentToDelete: { sectionId, commentId } });
    this.openDeleteModal();
  }

  onVoteComment(commentId, sectionId) {
    const { dispatch } = this.props;
    const hearingSlug = this.props.hearingSlug;
    dispatch(postVote(commentId, hearingSlug, sectionId));
  }

  onFollowHearing() {
    const { dispatch } = this.props;
    const hearingSlug = this.props.hearingSlug;
    dispatch(followHearing(hearingSlug));
  }

  getFollowButton() {
    if (this.props.user === null) {
      return null;
    }
    return (
      <span className="pull-right">
        <Button bsStyle="primary" onClick={this.onFollowHearing.bind(this)}>
          <Icon name="bell-o" /> <FormattedMessage id="follow" />
        </Button>
      </span>
    );
  }

  getClosureInfo(hearing) {
    const { formatMessage } = this.props.intl;
    const closureInfo = getClosureSection(hearing);
    if (closureInfo) {
      return closureInfo;
    }
    // Render default closure info if no custom section is specified
    return {
      type: 'closure-info',
      title: '',
      abstract: '',
      images: [],
      content: formatMessage({ id: 'defaultClosureInfo' }),
    };
  }

  getLinkToFullscreen(hearing) {
    if (!hasFullscreenMapPlugin(hearing)) {
      return null;
    }
    return (
      <Button bsStyle="primary" bsSize="large" block onClick={() => this.openFullscreen(hearing)}>
        <Icon name="arrows-alt" fixedWidth />
        <FormattedMessage id="openFullscreenMap" />
      </Button>
    );
  }

  isSectionVotable(section, user) {
    const hearing = this.props.hearing;
    return acceptsComments(hearing) && userCanVote(user, section);
  }

  isMainSectionVotable(user) {
    const hearing = this.props.hearing;
    const section = getMainSection(hearing);
    return this.isSectionVotable(section, user);
  }

  isSectionCommentable(section, user) {
    const hearing = this.props.hearing;
    return (
      acceptsComments(hearing) && userCanComment(user, section) && !section.plugin_identifier // comment box not available for sections with plugins
    );
  }

  isMainSectionCommentable(user) {
    const hearing = this.props.hearing;
    const section = getMainSection(hearing);
    return this.isSectionCommentable(section, user);
  }

  getCommentList() {
    const { hearing, sectionComments, location, hearingSlug, intl } = this.props;
    const mainSection = getMainSection(hearing);
    const showPluginInline = !mainSection.plugin_fullscreen;
    const user = this.props.user;
    let userIsAdmin = false;
    if (hearing && user && _.has(user, 'adminOrganizations')) {
      userIsAdmin = _.includes(user.adminOrganizations, hearing.organization);
    }
    if (!showPluginInline) {
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
            comments={sectionComments[mainSection.id] ? sectionComments[mainSection.id].results : []}
            canComment={this.isMainSectionCommentable(hearing, user)}
            onPostComment={this.onPostHearingComment.bind(this)}
            onEditComment={this.onEditSectionComment.bind(this)}
            onDeleteComment={this.handleDeleteClick.bind(this)}
            onPostVote={this.onVoteComment.bind(this)}
            canSetNickname={user === null}
            intl={intl}
          />
        </div>
      </div>
    );
  }

  openDeleteModal() {
    this.setState({ showDeleteModal: true });
  }

  closeDeleteModal() {
    this.setState({ showDeleteModal: false, commentToDelete: {} });
  }

  getEyeTooltip() { // eslint-disable-line class-methods-use-this
    const { formatMessage } = this.props.intl;
    const openingTime = moment(this.props.hearing.open_at);
    let text = <FormattedMessage id="eyeTooltip" />;
    if (this.props.hearing.published && openingTime > moment()) {
      const duration = moment.duration(openingTime.diff(moment()));
      const durationAs = duration.asHours() < 24 ? duration.asHours() : duration.asDays();
      const differenceText = duration < 24 ? "eyeTooltipOpensHours" : "eyeTooltipOpensDays";
      text = `${formatMessage({id: 'eyeTooltipOpens'})} ${Math.ceil(durationAs)} ${formatMessage({id: differenceText})}`;
    }
    return (
      <Tooltip id="eye-tooltip">{text}</Tooltip>
    );
  }

  render() {
    const { hearing, hearingSlug, user, language, dispatch, changeCurrentlyViewed, currentlyViewed } = this.props;
    const hearingAllowsComments = acceptsComments(hearing);
    const mainSection = getMainSection(hearing);
    const showPluginInline = Boolean(!mainSection.plugin_fullscreen && mainSection.plugin_identifier);
    const closureInfoSection = this.getClosureInfo(hearing);
    const regularSections = hearing.sections.filter(section => !isSpecialSectionType(section.type));
    const sectionGroups = groupSections(regularSections);
    const reportUrl = config.apiBaseUrl + '/v1/hearing/' + hearingSlug + '/report';
    const eyeTooltip = this.getEyeTooltip();

    return (
      <div className="hearing-wrapper" id="hearing-wrapper">
        <Header
          hearing={hearing}
          reportUrl={reportUrl}
          activeLanguage={language}
          eyeTooltip={eyeTooltip}
        />
        <Row>
          <Sidebar
            currentlyViewed={currentlyViewed}
            hearing={hearing}
            mainSection={mainSection}
            sectionGroups={sectionGroups}
            activeLanguage={language}
            dispatch={dispatch}
            hearingSlug={hearingSlug}
          />
          <Col md={8} lg={9}>
            <div id="hearing" className="hearing-content">
              <Waypoint onEnter={() => changeCurrentlyViewed('#hearing')} topOffset={'-30%'} />

              <HearingImageList images={mainSection.images} />
              <div
                className="hearing-abstract lead"
                dangerouslySetInnerHTML={{ __html: getAttr(hearing.abstract, language) }}
              />

              {hearing.closed ? <WrappedSection section={closureInfoSection} canComment={false} /> : null}
              {mainSection
                ? <WrappedSection
                    showPlugin={showPluginInline}
                    section={mainSection}
                    canComment={this.isMainSectionCommentable(hearing, user)}
                    onPostComment={this.onPostSectionComment.bind(this)}
                    onPostVote={this.onVoteComment.bind(this)}
                    canVote={this.isMainSectionVotable(user)}
                    comments={this.props.sectionComments[mainSection.id]}
                    user={user}
                />
                : null}
            </div>
            <div className="hearing-contacts">
              {hearing.contact_persons && hearing.contact_persons.length
                ? <h3>
                  <FormattedMessage id="contactPersons" />
                </h3>
                : null}
              <Row>
                {hearing.contact_persons &&
                  hearing.contact_persons.map((person, index) =>
                    <Col xs={6} md={4}><ContactCard
                      key={index} // eslint-disable-line react/no-array-index-key
                      activeLanguage={language}
                      {...person}
                    /></Col>,
                  )}
              </Row>
            </div>
            {this.getLinkToFullscreen(hearing)}
            {sectionGroups.map(sectionGroup =>
              <div className="hearing-section-group" id={'hearing-sectiongroup-' + sectionGroup.type} key={sectionGroup.type}>
                <Waypoint onEnter={() => changeCurrentlyViewed('#hearing-sectiongroup' + sectionGroup.name_singular)} />
                <SectionList
                  basePath={window ? window.location.pathname : ''}
                  sections={sectionGroup.sections}
                  canComment={hearingAllowsComments}
                  onPostComment={this.onPostSectionComment.bind(this)}
                  canVote={hearingAllowsComments}
                  onPostVote={this.onVoteComment.bind(this)}
                  sectionComments={this.props.sectionComments}
                  user={user}
                />
              </div>,
            )}
            <Waypoint onEnter={() => changeCurrentlyViewed('#hearing-comments')} topOffset={'-300px'} />
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
  dispatch: PropTypes.func,
  hearing: PropTypes.object,
  hearingSlug: PropTypes.string,
  language: PropTypes.string,
  location: PropTypes.object,
  user: PropTypes.object,
  sectionComments: PropTypes.object,
  changeCurrentlyViewed: PropTypes.func,
  currentlyViewed: PropTypes.string,
};

export function wrapHearingComponent(component, pure = true) {
  const wrappedComponent = connect(state => ({ language: state.language }), null, null, { pure })(
    injectIntl(component),
  );
  // We need to re-hoist the data statics to the wrapped component due to react-intl:
  wrappedComponent.canRenderFully = component.canRenderFully;
  wrappedComponent.fetchData = component.fetchData;
  return wrappedComponent;
}

export default wrapHearingComponent(Hearing);

function groupSections(sections) {
  const sectionGroups = [];
  sections.forEach(section => {
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
