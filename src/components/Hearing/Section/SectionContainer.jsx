/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-danger */
import React from 'react';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Collapse } from 'react-bootstrap';
import { Button } from 'hds-react';
import { connect, useSelector } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedPlural } from 'react-intl';

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
import { useParams } from 'react-router-dom';

function SectionContainerComponent(props) {
  const { language, user, onPostReply, fetchAllComments, fetchMoreComments, fetchCommentsForSortableList } = props;
  const showDeleteModal = false;
  const commentToDelete = {};
  const showLightbox = false;
  const mapContainer = null;
  const mapContainerMobile = null;
  // Open on desktop, closed on mobile
  const mainHearingDetailsOpen = typeof window !== 'undefined' && window.innerWidth >= 768;
  const mainHearingProjectOpen = false;
  const mainHearingContactsOpen = false;
  const mainHearingAttachmentsOpen = false;
  const params = useParams();
  const { hearingSlug, sectionId } = params;
  const hearing = useSelector(state => getHearingWithSlug(state, params.hearingSlug));
  const sections = useSelector(state => getSections(state, params.hearingSlug));
  const mainSectionComments = useSelector(state => getMainSectionComments(state, params.hearingSlug));
  const contacts = useSelector(state => getHearingContacts(state, params.hearingSlug));

  const getSectionNav = () => {
    const filterNotClosedSections = sections.filter((section) => section.type !== SectionTypes.CLOSURE);
    const filteredSections = filterNotClosedSections.filter((section) => section.type !== SectionTypes.MAIN);
    const currentSectionIndex = sectionId
      ? filteredSections.findIndex((section) => section.id === sectionId)
      : 0;
    const prevPath =
      currentSectionIndex - 1 >= 0
        ? `/${hearingSlug}/${filteredSections[currentSectionIndex - 1].id}`
        : undefined;
    const nextPath =
      currentSectionIndex + 1 < filteredSections.length
        ? `/${hearingSlug}/${filteredSections[currentSectionIndex + 1].id}`
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
  const handleReportDownload = (hearing, language) => {
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
  const handleSetMapContainer = (mapContainer) => {
    setState({ mapContainer });
  };

  const handleSetMapContainerMobile = (mapContainerMobile) => {
    setState({ mapContainerMobile });
  };

  /**
   * When "Show replies" is pressed.
   * Call the redecer to fetch sub comments and populate inside the specific comment
   */
  const handleGetSubComments = (commentId, sectionId) => {
    props.getCommentSubComments(commentId, sectionId);
  };

  const onPostComment = (sectionId, sectionCommentData) => {
    // Done
    const { authCode } = parseQuery(location.search);
    const commentData = { authCode, ...sectionCommentData };
    return props.postSectionComment(hearingSlug, sectionId, commentData);
  };

  const onVoteComment = (commentId, sectionId, isReply, parentId) => {
    props.postVote(commentId, hearingSlug, sectionId, isReply, parentId);
  };

  const onFlagComment = (commentId, sectionId, isReply, parentId) => {
    props.postFlag(commentId, hearingSlug, sectionId, isReply, parentId);
  };

  const onEditComment = (sectionId, commentId, commentData) => {
    const { authCode } = parseQuery(location.search);

    // eslint-disable-next-line prefer-object-spread
    Object.assign({ authCode }, commentData);

    props.editComment(hearingSlug, sectionId, commentId, commentData);
  };

  const onDeleteComment = () => {
    const { sectionId, commentId, refreshUser } = commentToDelete;
    props.deleteSectionComment(hearingSlug, sectionId, commentId, refreshUser);
    forceUpdate();
  };

  const onPostPluginComment = (text, authorName, pluginData, geojson, label, images) => {
    // Done
    const sectionCommentData = { text, authorName, pluginData, geojson, label, images };
    const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
    const { authCode } = parseQuery(location.search);
    const commentData = { authCode, ...sectionCommentData };
    postSectionComment(hearingSlug, mainSection.id, commentData);
  };

  const onVotePluginComment = (commentId) => {
    const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
    const sectionId = mainSection.id;
    postVote(commentId, hearingSlug, sectionId);
  };

  const handleDeleteClick = (sectionId, commentId, refreshUser) => {
    setState({ commentToDelete: { sectionId, commentId, refreshUser } });
    openDeleteModal();
  };

  const openDeleteModal = () => {
    setState({ showDeleteModal: true });
  };

  const closeDeleteModal = () => {
    setState({ showDeleteModal: false, commentToDelete: {} });
  };

  const openLightbox = () => {
    document.body.classList.remove('nav-fixed');
    setState({ showLightbox: true });
  };

  const closeLightbox = () => {
    document.body.classList.add('nav-fixed');
    setState({ showLightbox: false });
  };

  const isHearingAdmin = () =>
    props.user &&
    Array.isArray(props.user.adminOrganizations) &&
    props.user.adminOrganizations.includes(props.hearing.organization);

  /**
   * If files are attached to the section, render the files section
   * @returns {JSX<Component>} component if files exist.
   */
  const renderFileSection = (section, language, published) => {
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
              setState((prevState) => ({ mainHearingAttachmentsOpen: !prevState.mainHearingAttachmentsOpen }))
            }
            aria-controls='hearing-section-attachments-accordion'
            id='hearing-section-attachments-accordion-button'
            aria-expanded={mainHearingAttachmentsOpen ? 'true' : 'false'}
          >
            <Icon
              name='angle-right'
              className={mainHearingAttachmentsOpen ? 'open' : ''}
              aria-hidden='true'
            />
            <FormattedMessage id='attachments' />
          </button>
        </h2>
        <Collapse
          in={mainHearingAttachmentsOpen}
          id='hearing-section-attachments-accordion'
          aria-hidden={mainHearingAttachmentsOpen ? 'false' : 'true'}
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

  const renderProjectPhaseSection = (hearing, language) => {
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
              setState((prevState) => ({ mainHearingProjectOpen: !prevState.mainHearingProjectOpen }))
            }
            aria-controls='hearing-section-project-accordion'
            id='hearing-section-project-accordion-button'
            aria-expanded={mainHearingProjectOpen ? 'true' : 'false'}
          >
            <span>
              <Icon name='angle-right' className={mainHearingProjectOpen ? 'open' : ''} aria-hidden='true' />
              <FormattedMessage id='phase' /> {activePhaseIndex + 1}/{numberOfItems}
            </span>
            <span className='hearing-section-toggle-button-subtitle'>
              <FormattedMessage id='project' /> {getAttr(project.title, language)}
            </span>
          </button>
        </h2>
        <Collapse
          in={mainHearingProjectOpen}
          id='hearing-section-project-accordion'
          aria-hidden={mainHearingProjectOpen ? 'false' : 'true'}
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

  const renderContacts = (contacts, language) => {
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
              setState((prevState) => ({ mainHearingContactsOpen: !prevState.mainHearingContactsOpen }))
            }
            aria-controls='hearing-section-contacts-accordion'
            id='hearing-section-contacts-accordion-button'
            aria-expanded={mainHearingContactsOpen ? 'true' : 'false'}
          >
            <Icon name='angle-right' className={mainHearingContactsOpen ? 'open' : ''} aria-hidden='true' />
            <FormattedMessage id='contactPersons' />
          </button>
        </h2>
        <Collapse
          in={mainHearingContactsOpen}
          id='hearing-section-contacts-accordion'
          aria-hidden={mainHearingContactsOpen ? 'false' : 'true'}
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

  const renderCommentsSection = () => {
    const userIsAdmin = !isEmpty(user) && canEdit(user, hearing);
    const reportUrl = getApiURL(`/v1/hearing/${hearing.slug}/report`);
    const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
    const section = sections.find((sec) => sec.id === sectionId) || mainSection;

    return (
      <section className='hearing-section comments-section' id='comments-section' tabIndex={-1}>
        {reportUrl && renderReportDownload(reportUrl, userIsAdmin, hearing, language)}
        <SortableCommentList
          section={section}
          canComment={isSectionCommentable(hearing, section, user)}
          onPostComment={onPostComment}
          onPostReply={onPostReply}
          onGetSubComments={handleGetSubComments}
          canVote={isSectionVotable(hearing, section, user)}
          canFlag={isHearingAdmin()}
          onPostVote={onVoteComment}
          onPostFlag={onFlagComment}
          defaultNickname={user && user.displayName}
          isSectionComments={section}
          onDeleteComment={handleDeleteClick}
          onEditComment={onEditComment}
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

  const renderReportDownload = (reportUrl, userIsAdmin, hearing, language) => {
    // render either admin download button or normal download link for others
    if (userIsAdmin) {
      return (
        <Row className='row-no-gutters text-right'>
          <Button
            size='small'
            className='pull-right report-download-button kerrokantasi-btn supplementary'
            onClick={() => handleReportDownload(hearing, language)}
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

  const renderSectionImage = (section, language) => {
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
        openLightbox={openLightbox}
        closeLightbox={closeLightbox}
      />
    );
  };

  // eslint-disable-next-line class-methods-use-this
  const renderSectionContent = (section, language) => {
    if (isEmpty(section.content)) {
      return null;
    }
    return <div dangerouslySetInnerHTML={{ __html: getAttr(section.content, language) }} />;
  };

  // eslint-disable-next-line class-methods-use-this
  const renderSectionAbstract = (section, language) => {
    if (isEmpty(section.abstract)) {
      return null;
    }

    return <div className='lead' dangerouslySetInnerHTML={{ __html: getAttr(section.abstract, language) }} />;
  };

  const renderMainDetails = (hearing, section, language) => {
    const sectionImage = section.images[0];

    if (!isEmpty(section.content) || sectionImage) {
      return (
        <section className='hearing-section main-content'>
          <h2>
            <button
              type='button'
              className='hearing-section-toggle-button'
              onClick={() =>
                setState((prevState) => ({ mainHearingDetailsOpen: !prevState.mainHearingDetailsOpen }))
              }
              aria-controls='hearing-section-details-accordion'
              id='hearing-section-details-accordion-button'
              aria-expanded={mainHearingDetailsOpen ? 'true' : 'false'}
            >
              <Icon name='angle-right' className={mainHearingDetailsOpen ? 'open' : ''} aria-hidden='true' />
              <FormattedMessage id='sectionInformationTitle' />
            </button>
          </h2>
          <Collapse
            in={mainHearingDetailsOpen}
            id='hearing-section-details-accordion'
            aria-hidden={mainHearingDetailsOpen ? 'false' : 'true'}
            role='region'
          >
            <div className='accordion-content'>
              <div className='section-content-spacer'>
                {renderSectionImage(section, language)}
                {/* Render main section title if it exists and it's not the same as the hearing title */}
                {!isEmpty(section.title) && getAttr(hearing.title, language) !== getAttr(section.title, language) && (
                  <h3>{getAttr(section.title, language)}</h3>
                )}
                {renderSectionContent(section, language)}
              </div>
            </div>
          </Collapse>
        </section>
      );
    }
    return null;
  };

  const renderMainHearing = (section, mainSection) => {
    const published = 'published' in hearing ? hearing.published : true;

    return (
      <>
        {hearing.geojson && (
          <Col xs={12} className='hidden-md hidden-lg'>
            <div className='hearing-map-container' ref={handleSetMapContainerMobile}>
              <HearingMap hearing={hearing} mapContainer={mapContainerMobile} />
            </div>
          </Col>
        )}
        <Col md={8} mdPush={!hearing.geojson ? 2 : 0}>
          {renderMainDetails(hearing, section, language)}

          {renderProjectPhaseSection(hearing, language)}

          {renderContacts(contacts, language)}

          {renderFileSection(section, language, published)}

          {mainSection.plugin_identifier && (
            <section className='hearing-section plugin-content'>
              <PluginContent
                hearingSlug={hearingSlug}
                fetchAllComments={fetchAllComments}
                section={mainSection}
                comments={mainSectionComments}
                onPostComment={onPostPluginComment}
                onPostVote={onVotePluginComment}
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

          {renderCommentsSection()}
        </Col>
        {hearing.geojson && (
          <Col md={4} lg={3} lgPush={1} className='hidden-xs visible-sm visible-md visible-lg'>
            <div className='hearing-map-container' ref={handleSetMapContainer}>
              <HearingMap hearing={hearing} mapContainer={mapContainer} />
            </div>
          </Col>
        )}
      </>
    );
  };

  // eslint-disable-next-line class-methods-use-this
  const renderSubSectionAttachments = (section, language, published) => {
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

  const renderSubHearing = (section) => {

    const showSectionBrowser = sections.filter((sec) => sec.type !== SectionTypes.CLOSURE).length > 1;
    const published = 'published' in hearing ? hearing.published : true;

    return (
      <Col md={8} mdPush={2}>
        <h2 className='hearing-subsection-title'>
          <span className='hearing-subsection-title-counter'>
            <FormattedMessage id='subsectionTitle' />
            <span className='aria-hidden'>&nbsp;</span>
            {getSectionNav().currentNum}/{getSectionNav().totalNum}
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

        {renderSectionImage(section, language)}
        {renderSectionAbstract(section, language)}
        {renderSectionContent(section, language)}
        {renderSubSectionAttachments(section, language, published)}

        {showSectionBrowser && <SectionBrowser sectionNav={getSectionNav()} />}

        {renderCommentsSection()}
      </Col>
    );
  };

  const mainSection = sections.find((sec) => sec.type === SectionTypes.MAIN);
  const section = sections.find((sec) => sec.id === sectionId) || mainSection;

  return isEmpty(section) ? (
    <div>Loading</div>
  ) : (
    <Grid>
      <div className={`hearing-content-section ${isMainSection(section) ? 'main' : 'subsection'}`}>
        <Row>
          {isMainSection(section) ? renderMainHearing(section, mainSection) : renderSubHearing(section)}
        </Row>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        close={closeDeleteModal}
        onDeleteComment={onDeleteComment}
      />
    </Grid>
  );
}

const mapStateToProps = (state) => ({
  sectionComments: state.sectionComments,
  language: state.language,
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SectionContainerComponent));
