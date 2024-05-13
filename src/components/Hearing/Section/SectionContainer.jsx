/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-danger */
import React from 'react';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Collapse } from 'react-bootstrap';
import { Button } from 'hds-react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedPlural } from 'react-intl';
import { withRouter } from 'react-router-dom';

import ContactCard from '../../ContactCard';
import DeleteModal from '../../DeleteModal';
import HearingMap from '../HearingMap';
import Icon from '../../../utils/Icon';
import InternalLink from '../../InternalLink';
import Link from '../../LinkWithLang';
import PluginContent from '../../PluginContent';
import SectionAttachment from './SectionAttachment';
import SectionBrowser from '../../SectionBrowser';
import SectionImage from './SectionImage';
import SortableCommentList from '../../SortableCommentList';
import getAttr from '../../../utils/getAttr';
import SubSectionsList from './SubSectionsList';
import { hasFullscreenMapPlugin, canEdit, getHearingURL } from '../../../utils/hearing';
import { parseQuery } from '../../../utils/urlQuery';
import {
  getSections,
  getHearingContacts,
  getHearingWithSlug,
  getMainSectionComments,
} from '../../../selectors/hearing';
import { SectionTypes, isSectionVotable, isSectionCommentable, isMainSection } from '../../../utils/section';
import {
  postSectionComment,
  postVote,
  postFlag,
  editSectionComment,
  deleteSectionComment,
  fetchAllSectionComments,
  fetchSectionComments,
  fetchMoreSectionComments,
  getCommentSubComments,
} from '../../../actions';
import getUser from '../../../selectors/user';
import 'react-image-lightbox/style.css';
import { getApiTokenFromStorage, getApiURL } from '../../../api';

export class SectionContainerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteModal: false,
      commentToDelete: {},
      showLightbox: false,
      mapContainer: null,
      mapContainerMobile: null,
      // Open on desktop, closed on mobile
      mainHearingDetailsOpen: typeof window !== 'undefined' && window.innerWidth >= 768,
      mainHearingProjectOpen: false,
      mainHearingContactsOpen: false,
      mainHearingAttachmentsOpen: false,
    };
  }

  getSectionNav = () => {
    const { sections, match } = this.props;
    const filterNotClosedSections = sections.filter((section) => section.type !== SectionTypes.CLOSURE);
    const filteredSections = filterNotClosedSections.filter((section) => section.type !== SectionTypes.MAIN);
    const currentSectionIndex = match.params.sectionId
      ? filteredSections.findIndex((section) => section.id === match.params.sectionId)
      : 0;
    const prevPath =
      currentSectionIndex - 1 >= 0
        ? `/${match.params.hearingSlug}/${filteredSections[currentSectionIndex - 1].id}`
        : undefined;
    const nextPath =
      currentSectionIndex + 1 < filteredSections.length
        ? `/${match.params.hearingSlug}/${filteredSections[currentSectionIndex + 1].id}`
        : undefined;

    return {
      prev: {
        path: prevPath,
      },
      next: {
        path: nextPath,
      },
      currentNum: currentSectionIndex + 1,
      totalNum: filteredSections.length,
    };
  };

  // downloads report excel with user's credentials
  // eslint-disable-next-line class-methods-use-this
  handleReportDownload = (hearing, language) => {
    const accessToken = getApiTokenFromStorage();
    const reportUrl = getApiURL(`/v1/hearing/${hearing.slug}/report`);

    fetch(reportUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        // remove filename special characters to avoid potential naming issues
        const filename = hearing.title
          ? `${getAttr(hearing.title, language).replace(/[^a-zA-Z0-9 ]/g, '')}.xlsx`
          : 'kuuluminen.xlsx';

        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  // In order to keep a track of map container dimensions
  // Save reference in state.
  handleSetMapContainer = (mapContainer) => {
    this.setState({ mapContainer });
  };

  handleSetMapContainerMobile = (mapContainerMobile) => {
    this.setState({ mapContainerMobile });
  };

  /**
   * When "Show replies" is pressed.
   * Call the redecer to fetch sub comments and populate inside the specific comment
   */
  handleGetSubComments = (commentId, sectionId) => {
    this.props.getCommentSubComments(commentId, sectionId);
  };

  onPostComment = (sectionId, sectionCommentData) => {
    // Done
    const { match, location } = this.props;
    const { hearingSlug } = match.params;
    const { authCode } = parseQuery(location.search);
    const commentData = { authCode, ...sectionCommentData };
    return this.props.postSectionComment(hearingSlug, sectionId, commentData);
  };

  onVoteComment = (commentId, sectionId, isReply, parentId) => {
    const { match } = this.props;
    const { hearingSlug } = match.params;
    this.props.postVote(commentId, hearingSlug, sectionId, isReply, parentId);
  };

  onFlagComment = (commentId, sectionId, isReply, parentId) => {
    const { match } = this.props;
    const { hearingSlug } = match.params;
    this.props.postFlag(commentId, hearingSlug, sectionId, isReply, parentId);
  };

  onEditComment = (sectionId, commentId, commentData) => {
    const { match, location } = this.props;
    const { hearingSlug } = match.params;
    const { authCode } = parseQuery(location.search);

    // eslint-disable-next-line prefer-object-spread
    Object.assign({ authCode }, commentData);

    this.props.editComment(hearingSlug, sectionId, commentId, commentData);
  };

  onDeleteComment = () => {
    const { match } = this.props;
    const { sectionId, commentId, refreshUser } = this.state.commentToDelete;
    const { hearingSlug } = match.params;
    this.props.deleteSectionComment(hearingSlug, sectionId, commentId, refreshUser);
    this.forceUpdate();
  };

  onPostPluginComment = (text, authorName, pluginData, geojson, label, images) => {
    // Done
    const sectionCommentData = { text, authorName, pluginData, geojson, label, images };
    const { match, location, sections } = this.props;
    const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
    const { hearingSlug } = match.params;
    const { authCode } = parseQuery(location.search);
    const commentData = { authCode, ...sectionCommentData };
    this.props.postSectionComment(hearingSlug, mainSection.id, commentData);
  };

  onVotePluginComment = (commentId) => {
    const { match, sections } = this.props;
    const { hearingSlug } = match.params;
    const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
    const sectionId = mainSection.id;
    this.props.postVote(commentId, hearingSlug, sectionId);
  };

  handleDeleteClick = (sectionId, commentId, refreshUser) => {
    this.setState({ commentToDelete: { sectionId, commentId, refreshUser } });
    this.openDeleteModal();
  };

  openDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false, commentToDelete: {} });
  };

  openLightbox = () => {
    document.body.classList.remove('nav-fixed');
    this.setState({ showLightbox: true });
  };

  closeLightbox = () => {
    document.body.classList.add('nav-fixed');
    this.setState({ showLightbox: false });
  };

  isHearingAdmin = () =>
    this.props.user &&
    Array.isArray(this.props.user.adminOrganizations) &&
    this.props.user.adminOrganizations.includes(this.props.hearing.organization);

  /**
   * If files are attached to the section, render the files section
   * @returns {JSX<Component>} component if files exist.
   */
  renderFileSection = (section, language, published) => {
    const { files } = section;

    if (!(files && files.length > 0)) {
      return null;
    }

    return (
      <section className='hearing-section hearing-attachments'>
        <h2>
          <button
            type='button'
            className='hearing-section-toggle-button'
            onClick={() =>
              this.setState((prevState) => ({ mainHearingAttachmentsOpen: !prevState.mainHearingAttachmentsOpen }))
            }
            aria-controls='hearing-section-attachments-accordion'
            id='hearing-section-attachments-accordion-button'
            aria-expanded={this.state.mainHearingAttachmentsOpen ? 'true' : 'false'}
          >
            <Icon
              name='angle-right'
              className={this.state.mainHearingAttachmentsOpen ? 'open' : ''}
              aria-hidden='true'
            />
            <FormattedMessage id='attachments' />
          </button>
        </h2>
        <Collapse
          in={this.state.mainHearingAttachmentsOpen}
          id='hearing-section-attachments-accordion'
          aria-hidden={this.state.mainHearingAttachmentsOpen ? 'false' : 'true'}
          role='region'
        >
          <div className='accordion-content'>
            <div className='section-content-spacer'>
              {!published && (
                <p>
                  <FormattedMessage id='unpublishedAttachments' />
                </p>
              )}
              {files.map((file) => (
                <SectionAttachment file={file} key={`file-${file.url}`} language={language} />
              ))}
            </div>
          </div>
        </Collapse>
      </section>
    );
  };

  renderProjectPhaseSection = (hearing, language) => {
    const project = get(hearing, 'project');
    const phases = get(project, 'phases') || [];
    const activePhaseIndex = findIndex(phases, (phase) => phase.is_active);
    const numberOfItems = phases.length;

    if (isEmpty(project)) {
      return null;
    }

    return (
      <section className='hearing-section hearing-project'>
        <h2>
          <button
            type='button'
            className='hearing-section-toggle-button'
            onClick={() =>
              this.setState((prevState) => ({ mainHearingProjectOpen: !prevState.mainHearingProjectOpen }))
            }
            aria-controls='hearing-section-project-accordion'
            id='hearing-section-project-accordion-button'
            aria-expanded={this.state.mainHearingProjectOpen ? 'true' : 'false'}
          >
            <span>
              <Icon name='angle-right' className={this.state.mainHearingProjectOpen ? 'open' : ''} aria-hidden='true' />
              <FormattedMessage id='phase' /> {activePhaseIndex + 1}/{numberOfItems}
            </span>
            <span className='hearing-section-toggle-button-subtitle'>
              <FormattedMessage id='project' /> {getAttr(project.title, language)}
            </span>
          </button>
        </h2>
        <Collapse
          in={this.state.mainHearingProjectOpen}
          id='hearing-section-project-accordion'
          aria-hidden={this.state.mainHearingProjectOpen ? 'false' : 'true'}
          role='region'
        >
          <div className='accordion-content'>
            <div className='project-phases-list section-content-spacer'>
              {phases.map((phase, index) => (
                <div className='phases-list-item' key={phase.id}>
                  <div className={`phase-order ${phase.is_active ? 'active-phase' : ''}`}>
                    <span className='sr-only'>
                      <FormattedMessage id='phase' />
                    </span>
                    {index + 1}
                    {phase.is_active && (
                      <span className='sr-only'>
                        <FormattedMessage id='phaseActive' />
                      </span>
                    )}
                  </div>
                  <div className='phase-texts'>
                    <span className='phase-title'>
                      {!isEmpty(phase.hearings) ? (
                        <Link to={{ path: phase.hearings[0] }}>{getAttr(phase.title, language)}</Link>
                      ) : (
                        <span>{getAttr(phase.title, language)}</span>
                      )}
                    </span>
                    <span className='phase-description'>{getAttr(phase.description, language)}</span>
                    <span className='phase-schedule'>{getAttr(phase.schedule, language)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Collapse>
      </section>
    );
  };

  renderContacts = (contacts, language) => {
    if (isEmpty(contacts)) {
      return null;
    }

    return (
      <section className='hearing-section hearing-contacts'>
        <h2>
          <button
            type='button'
            className='hearing-section-toggle-button'
            onClick={() =>
              this.setState((prevState) => ({ mainHearingContactsOpen: !prevState.mainHearingContactsOpen }))
            }
            aria-controls='hearing-section-contacts-accordion'
            id='hearing-section-contacts-accordion-button'
            aria-expanded={this.state.mainHearingContactsOpen ? 'true' : 'false'}
          >
            <Icon name='angle-right' className={this.state.mainHearingContactsOpen ? 'open' : ''} aria-hidden='true' />
            <FormattedMessage id='contactPersons' />
          </button>
        </h2>
        <Collapse
          in={this.state.mainHearingContactsOpen}
          id='hearing-section-contacts-accordion'
          aria-hidden={this.state.mainHearingContactsOpen ? 'false' : 'true'}
          role='region'
        >
          <div className='accordion-content'>
            <div className='section-content-spacer'>
              <Row>
                {contacts.map((person) => (
                  <ContactCard activeLanguage={language} key={person.id} {...person} />
                ))}
              </Row>
            </div>
          </div>
        </Collapse>
      </section>
    );
  };

  renderCommentsSection = () => {
    const {
      fetchAllComments,
      fetchCommentsForSortableList,
      fetchMoreComments,
      hearing,
      language,
      match,
      sections,
      user,
    } = this.props;

    const userIsAdmin = !isEmpty(user) && canEdit(user, hearing);
    const reportUrl = getApiURL(`/v1/hearing/${hearing.slug}/report`);
    const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
    const section = sections.find((sec) => sec.id === match.params.sectionId) || mainSection;

    return (
      <section className='hearing-section comments-section' id='comments-section' tabIndex={-1}>
        {reportUrl && this.renderReportDownload(reportUrl, userIsAdmin, hearing, language)}
        <SortableCommentList
          section={section}
          canComment={isSectionCommentable(hearing, section, user)}
          onPostComment={this.onPostComment}
          onPostReply={this.onPostReply}
          onGetSubComments={this.handleGetSubComments}
          canVote={isSectionVotable(hearing, section, user)}
          canFlag={this.isHearingAdmin()}
          onPostVote={this.onVoteComment}
          onPostFlag={this.onFlagComment}
          defaultNickname={user && user.displayName}
          isSectionComments={section}
          onDeleteComment={this.handleDeleteClick}
          onEditComment={this.onEditComment}
          fetchAllComments={fetchAllComments}
          fetchComments={fetchCommentsForSortableList}
          fetchMoreComments={fetchMoreComments}
          displayVisualization={userIsAdmin || hearing.closed}
          published={hearing.published} // Needed so comments are not diplayed in hearing drafts
          closed={hearing.closed}
          hearingGeojson={hearing.geojson}
        />
      </section>
    );
  };

  renderReportDownload = (reportUrl, userIsAdmin, hearing, language) => {
    // render either admin download button or normal download link for others
    if (userIsAdmin) {
      return (
        <Row className='row-no-gutters text-right'>
          <Button
            size='small'
            className='pull-right report-download-button kerrokantasi-btn supplementary'
            onClick={() => this.handleReportDownload(hearing, language)}
          >
            <Icon name='download' aria-hidden='true' /> <FormattedMessage id='downloadReport' />
          </Button>
        </Row>
      );
    }

    return (
      <p className='report-download text-right small'>
        <a href={reportUrl}>
          <Icon name='download' aria-hidden='true' /> <FormattedMessage id='downloadReport' />
        </a>
      </p>
    );
  };

  renderSectionImage = (section, language) => {
    const { showLightbox } = this.state;
    const sectionImage = section.images[0];

    if (!sectionImage) {
      return null;
    }

    return (
      <SectionImage
        image={sectionImage}
        caption={getAttr(sectionImage.caption, language)}
        title={getAttr(sectionImage.title, language)}
        altText={getAttr(sectionImage.alt_text, language)}
        showLightbox={showLightbox}
        openLightbox={this.openLightbox}
        closeLightbox={this.closeLightbox}
      />
    );
  };

  // eslint-disable-next-line class-methods-use-this
  renderSectionContent = (section, language) => {
    if (isEmpty(section.content)) {
      return null;
    }
    return <div dangerouslySetInnerHTML={{ __html: getAttr(section.content, language) }} />;
  };

  // eslint-disable-next-line class-methods-use-this
  renderSectionAbstract = (section, language) => {
    if (isEmpty(section.abstract)) {
      return null;
    }

    return <div className='lead' dangerouslySetInnerHTML={{ __html: getAttr(section.abstract, language) }} />;
  };

  renderMainDetails = (hearing, section, language) => {
    const sectionImage = section.images[0];

    if (!isEmpty(section.content) || sectionImage) {
      return (
        <section className='hearing-section main-content'>
          <h2>
            <button
              type='button'
              className='hearing-section-toggle-button'
              onClick={() =>
                this.setState((prevState) => ({ mainHearingDetailsOpen: !prevState.mainHearingDetailsOpen }))
              }
              aria-controls='hearing-section-details-accordion'
              id='hearing-section-details-accordion-button'
              aria-expanded={this.state.mainHearingDetailsOpen ? 'true' : 'false'}
            >
              <Icon name='angle-right' className={this.state.mainHearingDetailsOpen ? 'open' : ''} aria-hidden='true' />
              <FormattedMessage id='sectionInformationTitle' />
            </button>
          </h2>
          <Collapse
            in={this.state.mainHearingDetailsOpen}
            id='hearing-section-details-accordion'
            aria-hidden={this.state.mainHearingDetailsOpen ? 'false' : 'true'}
            role='region'
          >
            <div className='accordion-content'>
              <div className='section-content-spacer'>
                {this.renderSectionImage(section, language)}
                {/* Render main section title if it exists and it's not the same as the hearing title */}
                {!isEmpty(section.title) && getAttr(hearing.title, language) !== getAttr(section.title, language) && (
                  <h3>{getAttr(section.title, language)}</h3>
                )}
                {this.renderSectionContent(section, language)}
              </div>
            </div>
          </Collapse>
        </section>
      );
    }
    return null;
  };

  renderMainHearing = (section, mainSection) => {
    const { contacts, fetchAllComments, hearing, language, mainSectionComments, match, user } = this.props;

    const published = 'published' in hearing ? hearing.published : true;

    return (
      <>
        {hearing.geojson && (
          <Col xs={12} className='hidden-md hidden-lg'>
            <div className='hearing-map-container' ref={this.handleSetMapContainerMobile}>
              <HearingMap hearing={hearing} mapContainer={this.state.mapContainerMobile} />
            </div>
          </Col>
        )}
        <Col md={8} mdPush={!hearing.geojson ? 2 : 0}>
          {this.renderMainDetails(hearing, section, language)}

          {this.renderProjectPhaseSection(hearing, language)}

          {this.renderContacts(contacts, language)}

          {this.renderFileSection(section, language, published)}

          {mainSection.plugin_identifier && (
            <section className='hearing-section plugin-content'>
              <PluginContent
                hearingSlug={match.params.hearingSlug}
                fetchAllComments={fetchAllComments}
                section={mainSection}
                comments={mainSectionComments}
                onPostComment={this.onPostPluginComment}
                onPostVote={this.onVotePluginComment}
                user={user}
              />
              {hasFullscreenMapPlugin(hearing) && (
                <Button>
                  <Link
                    to={{ path: getHearingURL(hearing, { fullscreen: true }) }}
                  >
                    <Icon name='arrows-alt' fixedWidth aria-hidden='true' />
                    &nbsp;
                    <FormattedMessage id='openFullscreenMap' />
                  </Link>
                </Button>
              )}
            </section>
          )}

          <SubSectionsList hearing={hearing} language={language} />

          {this.renderCommentsSection()}
        </Col>
        {hearing.geojson && (
          <Col md={4} lg={3} lgPush={1} className='hidden-xs visible-sm visible-md visible-lg'>
            <div className='hearing-map-container' ref={this.handleSetMapContainer}>
              <HearingMap hearing={hearing} mapContainer={this.state.mapContainer} />
            </div>
          </Col>
        )}
      </>
    );
  };

  // eslint-disable-next-line class-methods-use-this
  renderSubSectionAttachments = (section, language, published) => {
    const { files } = section;

    if (!(files && files.length > 0)) {
      return null;
    }
    return (
      <div className='hearing-subsection-attachments'>
        <h3>
          <FormattedMessage id='attachments' />
        </h3>
        <div>
          {!published && (
            <p>
              <FormattedMessage id='unpublishedAttachments' />
            </p>
          )}
          {files.map((file) => (
            <SectionAttachment file={file} key={`file-${file.url}`} language={language} />
          ))}
        </div>
      </div>
    );
  };

  renderSubHearing = (section) => {
    const { hearing, language, sections, user } = this.props;

    const showSectionBrowser = sections.filter((sec) => sec.type !== SectionTypes.CLOSURE).length > 1;
    const published = 'published' in hearing ? hearing.published : true;

    return (
      <Col md={8} mdPush={2}>
        <h2 className='hearing-subsection-title'>
          <span className='hearing-subsection-title-counter'>
            <FormattedMessage id='subsectionTitle' />
            <span className='aria-hidden'>&nbsp;</span>
            {this.getSectionNav().currentNum}/{this.getSectionNav().totalNum}
          </span>
          {getAttr(section.title, language)}
        </h2>

        {!(section.commenting === 'none') && (
          <div className='hearing-subsection-comments-header'>
            <div className='hearing-subsection-comments'>
              <Icon name='comment-o' fixedWidth />
              &nbsp;
              <FormattedPlural
                value={section.n_comments}
                one={<FormattedMessage id='sectionTotalComment' values={{ n: section.n_comments }} />}
                other={<FormattedMessage id='sectionTotalComments' values={{ n: section.n_comments }} />}
              />
            </div>
            {isSectionCommentable(hearing, section, user) && (
              <InternalLink destinationId='comments-section' className='hearing-subsection-write-comment-link'>
                <FormattedMessage id='headerWriteCommentLink' />
              </InternalLink>
            )}
          </div>
        )}

        {this.renderSectionImage(section, language)}
        {this.renderSectionAbstract(section, language)}
        {this.renderSectionContent(section, language)}
        {this.renderSubSectionAttachments(section, language, published)}

        {showSectionBrowser && <SectionBrowser sectionNav={this.getSectionNav()} />}

        {this.renderCommentsSection()}
      </Col>
    );
  };

  render() {
    const { match, sections } = this.props;
    const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
    const section = sections.find((sec) => sec.id === match.params.sectionId) || mainSection;

    return isEmpty(section) ? (
      <div>Loading</div>
    ) : (
      <Grid>
        <div className={`hearing-content-section ${isMainSection(section) ? 'main' : 'subsection'}`}>
          <Row>
            {isMainSection(section) ? this.renderMainHearing(section, mainSection) : this.renderSubHearing(section)}
          </Row>
        </div>
        <DeleteModal
          isOpen={this.state.showDeleteModal}
          close={this.closeDeleteModal}
          onDeleteComment={this.onDeleteComment}
        />
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  hearing: getHearingWithSlug(state, ownProps.match.params.hearingSlug),
  sections: getSections(state, ownProps.match.params.hearingSlug),
  sectionComments: state.sectionComments,
  mainSectionComments: getMainSectionComments(state, ownProps.match.params.hearingSlug),
  language: state.language,
  contacts: getHearingContacts(state, ownProps.match.params.hearingSlug),
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  postSectionComment: (hearingSlug, sectionId, commentData) =>
    dispatch(postSectionComment(hearingSlug, sectionId, commentData)),
  getCommentSubComments: (commentId, sectionId) => dispatch(getCommentSubComments(commentId, sectionId)),
  postVote: (commentId, hearingSlug, sectionId, isReply, parentId) =>
    dispatch(postVote(commentId, hearingSlug, sectionId, isReply, parentId)),
  postFlag: (commentId, hearingSlug, sectionId, isReply, parentId) =>
    dispatch(postFlag(commentId, hearingSlug, sectionId, isReply, parentId)),
  editComment: (hearingSlug, sectionId, commentId, commentData) =>
    dispatch(editSectionComment(hearingSlug, sectionId, commentId, commentData)),
  deleteSectionComment: (hearingSlug, sectionId, commentId, refreshUser) =>
    dispatch(deleteSectionComment(hearingSlug, sectionId, commentId, refreshUser)),
  fetchAllComments: (hearingSlug, sectionId, ordering) =>
    dispatch(fetchAllSectionComments(hearingSlug, sectionId, ordering)),
  fetchCommentsForSortableList: (sectionId, ordering) => dispatch(fetchSectionComments(sectionId, ordering)),
  fetchMoreComments: (sectionId, ordering, nextUrl) => dispatch(fetchMoreSectionComments(sectionId, nextUrl, ordering)),
});

SectionContainerComponent.propTypes = {
  contacts: PropTypes.array,
  deleteSectionComment: PropTypes.func,
  editComment: PropTypes.func,
  fetchAllComments: PropTypes.func,
  fetchCommentsForSortableList: PropTypes.func,
  fetchMoreComments: PropTypes.func,
  getCommentSubComments: PropTypes.func,
  hearing: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  mainSectionComments: PropTypes.object,
  match: PropTypes.object,
  postSectionComment: PropTypes.func,
  postVote: PropTypes.func,
  postFlag: PropTypes.func,
  sections: PropTypes.array,
  user: PropTypes.object,
};

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(SectionContainerComponent)));
